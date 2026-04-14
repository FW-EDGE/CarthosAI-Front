import React from "react";
import { motion } from "motion/react";
import { LearningPath } from "../../types/types";
import { ProgressLayout } from "../../components/ProgressLayout/ProgressLayout";
import { Language } from "../../constants/translations";

interface ProgressSectionProps {
  learningPaths: LearningPath[];
  language: Language;
  onNavigateToMap: () => void;
}

export const ProgressSection = ({
  learningPaths,
  language,
  onNavigateToMap,
}: ProgressSectionProps) => {
  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProgressLayout
        learningPaths={learningPaths}
        onNavigateToMap={onNavigateToMap}
        language={language}
      />
    </motion.div>
  );
};
