import { createContext, useContext } from "react";

/**
 * The stage tells the pages when the curtain is up.
 *
 * Reveal animations must not run while the screen is covered — otherwise the
 * entrance plays behind the veil and the visitor never sees it. So the pages
 * stay dormant until the stage says it is clear.
 *
 * It lives in its own module so App and MotionPage can both read it without
 * importing each other.
 */
export const Stage = createContext(true);
export const useStage = () => useContext(Stage);
