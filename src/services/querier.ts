import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ExerciseListResponse } from "../types/api/responses/ExerciseLIstResponse";
import { WorkoutResponse } from "../types/api/responses/workoutResponse";
import { WorkoutListResponse } from "../types/api/responses/workoutListResponse";
import { WorkoutLogRequest } from "../types/api/requests/workoutLogRequest";

// Define our API service using RTK Query
export const workoutService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }), // Adjust the baseUrl to your API URL
  tagTypes: ["WorkoutSuggestion", "WorkoutLogs"],
  endpoints: (builder) => ({
    getExercises: builder.query<ExerciseListResponse, void>({
      query: () => "/exercises",
    }),
    getWorkouts: builder.query<WorkoutListResponse, void>({
      query: () => "/workouts",
      providesTags: ["WorkoutLogs"],
    }),
    generateWorkout: builder.query<WorkoutResponse, number>({
      query: (exerciseCount) =>
        `/generate-workout?exerciseCount=${exerciseCount}`,
      providesTags: ["WorkoutSuggestion"],
    }),
    logWorkout: builder.mutation<void, WorkoutLogRequest>({
      query: (workoutLog) => ({
        url: "/workouts",
        method: "POST",
        body: workoutLog,
      }),
      invalidatesTags: ["WorkoutLogs", "WorkoutSuggestion"],
    }),
  }),
});

// Export the auto-generated hooks for each endpoint
export const {
  useGetExercisesQuery,
  useGetWorkoutsQuery,
  useGenerateWorkoutQuery,
  useLogWorkoutMutation,
} = workoutService;
