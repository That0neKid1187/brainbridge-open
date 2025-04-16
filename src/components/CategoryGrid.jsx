import React from "react";
import { Link } from "react-router-dom";
import { AcademicCapIcon, BriefcaseIcon, GlobeAltIcon, SparklesIcon, BanknotesIcon, CalculatorIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const categories = [
  { title: "STEM Education", path: "/categories/stem", icon: AcademicCapIcon },
  { title: "Career Guidance", path: "/categories/career", icon: BriefcaseIcon },
  { title: "Civic Engagement", path: "/categories/civic", icon: GlobeAltIcon },
  { title: "College Admissions", path: "/categories/college", icon: SparklesIcon },
  { title: "Math", path: "/categories/math", icon: CalculatorIcon },
  { title: "Philosophy", path: "/categories/philosophy", icon: BookOpenIcon },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {categories.map(({ title, path, icon: Icon }) => (
        <Link
          to={path}
          key={title}
          className="flex flex-col items-center justify-center p-6 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow hover:shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition group"
        >
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white text-center group-hover:text-blue-600">
            {title}
          </h3>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;