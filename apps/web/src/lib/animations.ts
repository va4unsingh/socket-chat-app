export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const hoverScale = {
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300 },
  },
};

export const iconHover = {
    hover: {
        scale: 1.2,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
}
