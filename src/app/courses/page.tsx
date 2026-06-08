"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import CodeBuddy from "@/components/ui/CodeBuddy";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { defaultCourses } from "@/lib/utils";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
  const router = useRouter();
  const { user, activeCourse, setActiveCourse } = useStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("opencodeLingo_courses");
    if (stored) {
      setCourses(JSON.parse(stored));
    } else {
      setCourses(defaultCourses);
    }
  }, []);

  const handleSelectCourse = async (course: Course) => {
    if (!user) return;

    const alreadyEnrolled = userCourses.includes(course.id);
    if (!alreadyEnrolled) {
      setUserCourses((prev) => [...prev, course.id]);
      if (user) {
        await supabase.from("user_courses").upsert({
          user_id: user.id,
          course_id: course.id,
          is_active: true,
        });
      }
    }

    setActiveCourse(course);
    localStorage.setItem("opencodeLingo_activeCourse", JSON.stringify(course));
    if (!alreadyEnrolled) {
      localStorage.setItem(
        "opencodeLingo_courses",
        JSON.stringify([...courses])
      );
    }
    router.push("/learn");
  };

  return (
    <AuthGuard>
      <Navigation />
      <div className="min-h-screen pb-24 md:pt-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <CodeBuddy size="md" state="success" message="Pick a language and let's start coding!" />
            <div>
              <h1 className="text-3xl font-bold mb-1">Omniverse Course Hub</h1>
              <p className="text-muted-foreground">
                Pick a language and start your journey. All courses are free and
                immediately accessible.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => {
              const isActive = activeCourse?.id === course.id;
              const isEnrolled = userCourses.includes(course.id);
              return (
                <motion.button
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCourse(course)}
                  className={`card-bouncy p-6 text-left relative overflow-hidden ${
                    isActive
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  {isEnrolled && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}

                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: course.theme_color + "20" }}
                  >
                    <div
                      className="w-8 h-8"
                      dangerouslySetInnerHTML={{ __html: course.icon_svg }}
                    />
                  </div>

                  <h3 className="text-lg font-bold mb-1">
                    {course.language_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isActive
                      ? "Currently active"
                      : isEnrolled
                      ? "Enrolled"
                      : "Not started"}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-primary font-medium mt-4">
                    {isEnrolled ? "Continue" : "Start learning"}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
