const {
   DOMAINS_LIST,
   COMMON_SKILLS,
   WEB_DEV_SKILLS,
   MOBILE_APP_SKILLS,
   AI_ML_SKILLS,
   UI_UX_SKILLS,
   DATA_SCIENCE_SKILLS,
   IOT_SKILLS,
   SKILLS_LIST,
} = require("../constants");

async function handleGetConstants(req, res) {
   try {
      // Some skills belong to more than one domain, so remove the duplicates
      const skills = [...new Set(SKILLS_LIST)];

      return res.status(200).json({
         message: "Constants fetched successfully",
         constants: {
            domains: DOMAINS_LIST,
            skills,
            skillsByDomain: {
               Common: COMMON_SKILLS,
               "Web Development": WEB_DEV_SKILLS,
               "Mobile Apps": MOBILE_APP_SKILLS,
               "AI/ML": AI_ML_SKILLS,
               "UI/UX Design": UI_UX_SKILLS,
               "Data Science": DATA_SCIENCE_SKILLS,
               IOT: IOT_SKILLS,
            },
            difficulties: ["beginner", "intermediate", "advanced"],
            projectStatuses: ["open", "in_progress", "closed", "cancelled"],
            applicationStatuses: ["pending", "accepted", "rejected", "cancelled"],
            teamSizeRanges: ["2-3", "4-5", "6+"],
            // most_popular and best_match are not listed yet, their sorting is broken
            sortOptions: ["most_recent", "deadline_soon"],
            teamSizeLimits: { min: 2, max: 8 },
            ratingLimits: { min: 0, max: 5 },
         },
      });
   } catch (error) {
      console.error("Error fetching constants:", error);
      return res.status(500).json({ message: "Internal server error" });
   }
}

module.exports = { handleGetConstants };
