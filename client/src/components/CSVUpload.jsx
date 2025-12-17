import { useState, useRef } from 'react';
import { createAthlete, createSession } from '../services/api';

const CSVUpload = ({ athletes, onAthletesImported, onSessionsImported }) => {
  const [uploadType, setUploadType] = useState('athletes'); // 'athletes' or 'sessions'
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');

    // Simple CSV parser that handles quoted fields
    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '').replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]).map((v) => v.replace(/^"|"$/g, ''));
      if (values.length < headers.length) continue; // Skip malformed rows

      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }

    return { headers: parseLine(lines[0]).map((h) => h.replace(/"/g, '')), rows };
  };

  const mapAthleteRow = (row) => {
    return {
      fullName: row.fullname || row.name || '',
      gym: row.gym || row.team || undefined,
      weightClass: row.weightclass || row.weight || undefined,
      stance: row.stance || 'orthodox',
      experienceYears: row.experienceyears || row.experience ? Number(row.experienceyears || row.experience) : undefined,
      focusAreas: row.focusareas || row.focus ? (row.focusareas || row.focus).split(',').map((f) => f.trim()).filter(Boolean) : [],
      coach: row.coach || undefined,
      contact: {
        phone: row.phone || row.contactphone || undefined,
        email: row.email || row.contactemail || undefined,
      },
    };
  };

  const mapSessionRow = (row, athletes) => {
    // Find athlete by name or ID - normalize for matching
    const athleteNameInput = (row.athlete || row.athletename || row.fullname || '').trim();
    if (!athleteNameInput) {
      throw new Error('Athlete name is required in CSV (check "athlete" column)');
    }

    // Normalize athlete names for comparison (trim, lowercase, remove extra spaces)
    const normalizeName = (name) => name.trim().toLowerCase().replace(/\s+/g, ' ');

    // Try exact match first (case-insensitive, trimmed, normalized spaces)
    let athlete = athletes.find((a) => {
      const normalizedFullName = normalizeName(a.fullName);
      const normalizedInput = normalizeName(athleteNameInput);
      return normalizedFullName === normalizedInput || a._id === athleteNameInput;
    });

    // If no exact match, try partial match (contains)
    if (!athlete) {
      const normalizedInput = normalizeName(athleteNameInput);
      athlete = athletes.find((a) => {
        const normalizedFullName = normalizeName(a.fullName);
        return normalizedFullName.includes(normalizedInput) || normalizedInput.includes(normalizedFullName);
      });
    }

    if (!athlete) {
      const availableNames = athletes.length > 0 
        ? athletes.map(a => `"${a.fullName}"`).join(', ')
        : 'None - import athletes first';
      throw new Error(
        `Athlete "${athleteNameInput}" not found. Available: ${availableNames}`
      );
    }

    return {
      athlete: athlete._id,
      sessionType: row.sessiontype || row.type || 'sparring',
      date: row.date || new Date().toISOString().split('T')[0],
      location: row.location || undefined,
      durationMinutes: row.durationminutes || row.duration ? Number(row.durationminutes || row.duration) : undefined,
      intensity: row.intensity ? Number(row.intensity) : undefined,
      fatigue: row.fatigue ? Number(row.fatigue) : undefined,
      recoveryScore: row.recoveryscore || row.recovery ? Number(row.recoveryscore || row.recovery) : undefined,
      sleepHours: row.sleephours || row.sleep ? Number(row.sleephours || row.sleep) : undefined,
      readinessScore: row.readinessscore || row.readiness ? Number(row.readinessscore || row.readiness) : undefined,
      heartRateAvg: row.heartrateavg || row.heartrate ? Number(row.heartrateavg || row.heartrate) : undefined,
      calories: row.calories ? Number(row.calories) : undefined,
      focusAreas: row.focusareas || row.focus ? (row.focusareas || row.focus).split(',').map((f) => f.trim()).filter(Boolean) : [],
      subjectiveNotes: row.notes || row.subjectivenotes || undefined,
    };
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setPreview(null);
    setResults(null);

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);

      if (uploadType === 'athletes') {
        const mapped = rows.map(mapAthleteRow);
        setPreview({ type: 'athletes', data: mapped, headers, rawRows: rows.length });
      } else {
        if (!athletes || athletes.length === 0) {
          setError('Please import athletes first before importing sessions. Athletes are required to link sessions.');
          return;
        }
        
        // Try to map all rows and collect errors
        const validationErrors = [];
        const mapped = [];
        
        rows.forEach((row, idx) => {
          try {
            const session = mapSessionRow(row, athletes);
            mapped.push(session);
          } catch (err) {
            validationErrors.push(`Row ${idx + 2}: ${err.message}`);
          }
        });

        // Show preview even if some rows failed, but show errors
        if (validationErrors.length > 0) {
          setError(`Found ${validationErrors.length} error(s) in ${validationErrors.length} row(s):\n${validationErrors.slice(0, 5).join('\n')}${validationErrors.length > 5 ? `\n... and ${validationErrors.length - 5} more` : ''}\n\nAvailable athletes: ${athletes.map(a => a.fullName).join(', ')}`);
        }

        if (mapped.length === 0) {
          setError(`No valid sessions found. All rows had errors. Available athletes: ${athletes.map(a => a.fullName).join(', ')}`);
          return;
        }

        setPreview({ 
          type: 'sessions', 
          data: mapped, 
          headers, 
          rawRows: rows.length,
          availableAthletes: athletes.map(a => a.fullName)
        });
      }
    } catch (err) {
      setError(`Failed to parse CSV: ${err.message}`);
    }
  };

  const handleImport = async () => {
    if (!preview || !preview.data.length) return;

    setUploading(true);
    setError('');
    const results = { success: 0, failed: 0, errors: [] };

    try {
      for (let i = 0; i < preview.data.length; i++) {
        try {
          if (preview.type === 'athletes') {
            await createAthlete(preview.data[i]);
            results.success++;
          } else {
            await createSession(preview.data[i]);
            results.success++;
          }
        } catch (err) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: ${err.message}`);
        }
      }

      setResults(results);
      if (preview.type === 'athletes' && onAthletesImported) {
        onAthletesImported();
      }
      if (preview.type === 'sessions' && onSessionsImported) {
        onSessionsImported();
      }
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const fileName = uploadType === 'athletes' ? 'athletes_template.csv' : 'sessions_template.csv';
      const response = await fetch(`/${fileName}`);
      const csvContent = await response.text();
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback to inline template if file not found
      let csvContent = '';

      if (uploadType === 'athletes') {
        csvContent = `fullName,gym,weightClass,stance,experienceYears,focusAreas,coach,phone,email
John Doe,MMA Academy,Lightweight,orthodox,3,"Striking, Grappling",Coach Smith,1234567890,john.doe@example.com
Jane Smith,Fight Club,Middleweight,southpaw,5,"BJJ, Wrestling",Coach Jones,0987654321,jane.smith@example.com
Raj Kumar,Kathmandu Fight Gym,Welterweight,orthodox,2,"Striking, Footwork",Coach Gurung,9876543210,raj.kumar@example.com`;
      } else {
        csvContent = `athlete,sessionType,date,location,durationMinutes,intensity,fatigue,recoveryScore,sleepHours,readinessScore,heartRateAvg,calories,focusAreas,notes
John Doe,sparring,2024-01-15,Gym A,60,7,6,7,8,7,150,450,"Footwork, Defense",Good session today
Jane Smith,drilling,2024-01-15,Gym B,45,5,4,8,7,8,140,300,"Clinching, Takedowns",Focused on technique
Raj Kumar,sparring,2024-01-16,Kathmandu Fight Gym,50,6,5,7,8,7,145,380,"Striking, Combinations",Worked on combos`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${uploadType}_template.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h3>📤 CSV Import</h3>
        <p>Bulk import athletes or training sessions from CSV files</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <label style={{ flex: 1 }}>
          Import type
          <select value={uploadType} onChange={(e) => {
            setUploadType(e.target.value);
            setPreview(null);
            setError('');
            setResults(null);
          }}>
            <option value="athletes">Athletes</option>
            <option value="sessions">Training Sessions</option>
          </select>
        </label>
      </div>

      <div style={{ 
        padding: '1rem', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
        borderRadius: '12px',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>💡 Tips:</strong>
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
          <li>CSV files should have headers in the first row</li>
          <li>Column names are case-insensitive and spaces are ignored</li>
          <li>For sessions, athlete names must match existing athletes exactly</li>
          <li>Download the template to see the expected format</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="text"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          📁 Choose CSV File
        </button>
        <button type="button" className="text" onClick={downloadTemplate}>
          📥 Download Template
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {preview && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: '#dbeafe',
            borderRadius: '6px',
            marginBottom: '1rem',
            border: '1px solid #bfdbfe'
          }}>
            <strong>Preview:</strong> {preview.rawRows} rows found, {preview.data.length} valid entries
            {preview.type === 'sessions' && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#1e40af' }}>
                <strong>Available athletes:</strong> {preview.availableAthletes?.join(', ') || 'None'}
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
                  Make sure athlete names in your CSV exactly match one of the names above (case-insensitive)
                </div>
              </div>
            )}
          </div>

          <div style={{ 
            maxHeight: '300px', 
            overflow: 'auto', 
            marginBottom: '1rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            background: 'var(--bg-secondary)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', position: 'sticky', top: 0, zIndex: 10 }}>
                  {(uploadType === 'athletes' 
                    ? ['Full Name', 'Gym', 'Weight Class', 'Stance', 'Experience', 'Focus Areas']
                    : ['Athlete', 'Type', 'Date', 'Intensity', 'Fatigue', 'Duration']
                  ).slice(0, 6).map((h) => (
                    <th key={h} style={{ 
                      padding: '0.75rem', 
                      textAlign: 'left', 
                      borderBottom: '2px solid var(--border)',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.data.slice(0, 5).map((row, idx) => {
                  // Show key fields based on import type
                  const displayFields = uploadType === 'athletes' 
                    ? ['fullName', 'gym', 'weightClass', 'stance', 'experienceYears', 'focusAreas']
                    : ['athlete', 'sessionType', 'date', 'intensity', 'fatigue', 'durationMinutes'];
                  
                  return (
                    <tr key={idx} style={{ 
                      borderBottom: '1px solid var(--border)',
                      background: idx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)'
                    }}>
                      {displayFields.slice(0, 6).map((field) => {
                        const value = row[field];
                        let displayValue = '-';
                        if (value !== undefined && value !== null && value !== '') {
                          if (Array.isArray(value)) {
                            displayValue = value.join(', ');
                          } else if (typeof value === 'object') {
                            displayValue = JSON.stringify(value);
                          } else {
                            displayValue = String(value);
                          }
                        }
                        return (
                          <td key={field} style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {preview.data.length > 5 && (
              <div style={{ 
                padding: '0.75rem', 
                textAlign: 'center', 
                background: 'var(--bg-tertiary)',
                borderTop: '1px solid var(--border)'
              }}>
                <span className="muted">... and {preview.data.length - 5} more rows</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="primary"
            onClick={handleImport}
            disabled={uploading || preview.data.length === 0}
          >
            {uploading ? '⏳ Importing...' : `✅ Import ${preview.data.length} ${uploadType}`}
          </button>
        </div>
      )}

      {results && (
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          background: results.failed === 0 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
          borderRadius: '12px',
          border: `2px solid ${results.failed === 0 ? '#10b981' : '#f59e0b'}`
        }}>
          <strong>Import Results:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            ✅ Success: {results.success} | ❌ Failed: {results.failed}
          </div>
          {results.errors.length > 0 && (
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>View errors</summary>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {results.errors.slice(0, 10).map((err, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem' }}>{err}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVUpload;

