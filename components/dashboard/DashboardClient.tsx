"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { EditCourseDialog } from "./EditCourseDialog";
import { getCoursesByUser, Course } from "@/lib/api/course";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Loading from "@/components/Loading";

export default function DashboardClient() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const fetchCourses = useCallback(async (uid: string) => {
    setLoadingCourses(true);
    try {
      const data = await getCoursesByUser(uid);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const handleDeleted = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.course_id !== courseId));
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (!isMounted) return;

      setUserId(user.id);
      setLoadingUser(false);
      fetchCourses(user.id);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchCourses, router]);

  if (loadingUser) {
    return (
      <div className="flex flex-col gap-6 animate-pulse p-2">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-purple-300 to-violet-300" />
          <div className="h-5 w-40 rounded-xl bg-purple-100" />
        </div>
        <div className="h-3 w-32 rounded-lg bg-gray-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white border border-purple-100 shadow-sm shadow-purple-50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        userId={userId!}
        onCourseCreated={() => fetchCourses(userId!)}
      />

      {loadingCourses ? (
        <Loading />
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-purple-100 bg-white py-16 px-8 shadow-sm shadow-purple-50 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-700 tracking-tight">No courses yet</p>
            <p className="text-xs text-gray-400">Create your first course to get started.</p>
          </div>
        </div>
      ) : (
        <CourseGrid
          courses={courses}
          onEdit={setEditingCourse}
          onDeleted={handleDeleted}
        />
      )}

      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSaved={() => {
            setEditingCourse(null);
            fetchCourses(userId!);
          }}
        />
      )}
    </div>
  );
}