/**
 * Quiz API Service
 * Handles quiz related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Type definitions
export interface Category {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
}

/**
 * Get category data for quizzes
 */
export async function getCategoryData(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch category data.");
    }

    // The API may return a wrapped response like { data: [...] } or a raw array
    const categories = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.categories)
          ? result.categories
          : [];

    return categories;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An unexpected error occurred while fetching category data.",
    );
  }
}
