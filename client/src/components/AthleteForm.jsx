import { useState } from 'react';

const defaultState = {
  fullName: '',
  gym: '',
  weightClass: '',
  stance: 'orthodox',
  experienceYears: '',
  focusAreas: '',
  coach: '',
  phone: '',
  email: '',
};

const stances = ['orthodox', 'southpaw', 'switch', 'other'];

const AthleteForm = ({ onSubmit, isSubmitting }) => {
  const [form, setForm] = useState(defaultState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      fullName: form.fullName.trim(),
      gym: form.gym || undefined,
      weightClass: form.weightClass || undefined,
      stance: form.stance,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
      focusAreas: form.focusAreas ? form.focusAreas.split(',').map((val) => val.trim()).filter(Boolean) : [],
      coach: form.coach || undefined,
      contact: {
        phone: form.phone || undefined,
        email: form.email || undefined,
      },
    });
    setForm(defaultState);
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>Register Athlete</h3>
        <p>Capture key profile info, focus areas, and contacts.</p>
      </div>
      <div className="form-grid">
        <label>
          Full name*
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Gym / team
          <input name="gym" value={form.gym} onChange={handleChange} />
        </label>
        <label>
          Weight class
          <input name="weightClass" value={form.weightClass} onChange={handleChange} />
        </label>
        <label>
          Stance
          <select name="stance" value={form.stance} onChange={handleChange}>
            {stances.map((stance) => (
              <option key={stance} value={stance}>
                {stance}
              </option>
            ))}
          </select>
        </label>
        <label>
          Experience (yrs)
          <input name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={handleChange} />
        </label>
        <label>
          Focus areas (comma separated)
          <input name="focusAreas" value={form.focusAreas} onChange={handleChange} placeholder="Footwork, clinch, etc." />
        </label>
        <label>
          Coach
          <input name="coach" value={form.coach} onChange={handleChange} />
        </label>
        <label>
          Contact phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Contact email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
      </div>
      <button className="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save athlete'}
      </button>
    </form>
  );
};

export default AthleteForm;

