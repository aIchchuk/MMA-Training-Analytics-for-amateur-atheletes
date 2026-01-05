import math

class BiomechanicsProject:
    @staticmethod
    def calculate_angle(a, b, c):
        """Calculates the angle at point b given three points a, b, c."""
        radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
        angle = abs(radians * 180.0 / math.pi)
        if angle > 180.0:
            angle = 360 - angle
        return angle

    @staticmethod
    def get_distance(p1, p2):
        """Calculates Euclidean distance between two points."""
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

    @staticmethod
    def check_guard(wrist, ear):
        """Checks if the wrist is near the ear (a proxy for a high guard)."""
        # Wrist and ear are [x, y] coordinates
        dist = BiomechanicsProject.get_distance(wrist, ear)
        # 0.15 is a threshold relative to the normalized image size
        return dist < 0.15

    @staticmethod
    def get_hip_height(left_hip, right_hip):
        """Returns the average y-coordinate of the hips."""
        return (left_hip[1] + right_hip[1]) / 2
