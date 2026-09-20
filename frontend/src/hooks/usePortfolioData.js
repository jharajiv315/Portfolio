import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";

export const usePortfolioData = () => {
  const [data, setData] = useState({
    user: null,
    skills: [],
    projects: [],
    timelines: [],
    softwareApplications: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Perform requests in parallel
      const [userRes, skillsRes, projectsRes, timelineRes, appsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/api/v1/user/portfolio/me`, { withCredentials: true }),
        axios.get(`${API_URL}/api/v1/skill/getall`, { withCredentials: true }),
        axios.get(`${API_URL}/api/v1/project/getall`, { withCredentials: true }),
        axios.get(`${API_URL}/api/v1/timeline/getall`, { withCredentials: true }),
        axios.get(`${API_URL}/api/v1/softwareapplication/getall`, { withCredentials: true }),
      ]);

      const user = userRes.status === "fulfilled" ? userRes.value.data?.user || null : null;
      const skills = skillsRes.status === "fulfilled" ? skillsRes.value.data?.skills || [] : [];
      const projects = projectsRes.status === "fulfilled" ? projectsRes.value.data?.projects || [] : [];
      const timelines = timelineRes.status === "fulfilled" ? timelineRes.value.data?.timelines || [] : [];
      const softwareApplications =
        appsRes.status === "fulfilled" ? appsRes.value.data?.softwareApplications || [] : [];

      setData({
        user,
        skills,
        projects,
        timelines,
        softwareApplications,
        testimonials: [],
      });
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
      setError("Failed to load portfolio content. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return { ...data, loading, error, refetch: fetchPortfolioData };
};

export default usePortfolioData;
