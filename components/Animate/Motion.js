import { motion } from 'framer-motion';
import React from 'react';

export default function Motion({ children, posY = 10, delay = 0.5 }) {
  return (
    <motion.div
      initial={{
        y: posY,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: delay,
      }}
    >
      {children}
    </motion.div>
  );
}
