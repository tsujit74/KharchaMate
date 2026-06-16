"use client";

import { useState, useEffect, useCallback } from "react";
import { getMyInsights } from "@/app/services/expense.service";
import toast from "react-hot-toast";
import {
  InsightResponse,
  FilterType,
  CategoryType,
  CustomRange,
} from "../types/insight";

export function useInsights() {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState<FilterType>("this-month");
  const [category, setCategory] = useState<CategoryType>("ALL");
  const [customRange, setCustomRange] = useState<CustomRange>({
    start: "",
    end: "",
  });

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params: any = {};

      if (filter === "custom") {
        if (!customRange.start || !customRange.end) return;

        params.start = customRange.start;
        params.end = customRange.end;
      } else {
        params.filter = filter;
      }

      const res = await getMyInsights(params);
      setData(res);
    } catch (err: any) {
      const message = err.message || "Failed to load insights";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filter, customRange]);

 
  useEffect(() => {
    if (filter === "custom") return;
    fetchInsights();
  }, [filter, fetchInsights]);


  useEffect(() => {
    if (filter !== "custom") {
      setCustomRange({ start: "", end: "" });
    }
  }, [filter]);

  const applyCustomFilter = useCallback(() => {
    if (!customRange.start || !customRange.end) {
      setError("Please select both start and end dates.");
      toast.error("Please select both start and end dates.");
      return false;
    }

    if (customRange.start > customRange.end) {
      setError("Start date cannot be after end date.");
      toast.error("Start date cannot be after end date.");
      return false;
    }

    fetchInsights();
    return true;
  }, [customRange, fetchInsights]);

  return {
    data,
    loading,
    error,
    filter,
    setFilter,
    category,
    setCategory,
    customRange,
    setCustomRange,
    applyCustomFilter,
    setError,
  };
}