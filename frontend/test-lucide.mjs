import * as lucide from "lucide-react";
const required = [
  "Mail", "Phone", "Download", "ExternalLink", "Calendar", "MapPin",
  "Award", "Briefcase", "GraduationCap", "ArrowRight", "X", "ChevronLeft"
];
required.forEach(name => {
  console.log(`${name}: ${lucide[name] ? "OK" : "MISSING"}`);
});
