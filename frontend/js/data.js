/* ============================================================
   CloudVault DAM — Sample Data
   Realistic dummy data shared across pages
   ============================================================ */

const DAM_DATA = {

  currentUser: (function(){
    const saved = localStorage.getItem('dam_user');
    if(saved) return JSON.parse(saved);
    return {
      name:"Aditi Rao",
      email:"aditi.rao@brightwave-marketing.com",
      role:"Marketing Manager",
      department:"Brand & Content",
      avatar:"https://i.pravatar.cc/150?img=47"
    };
  })(),

  assets:[
    {id:1, name:"Summer Campaign Banner", type:"image", ext:"JPG", category:"Campaigns", tags:["summer","banner","social"], date:"2026-06-28", by:"Aditi Rao", size:"2.4 MB", visibility:"Public", downloads:214, color:"#2563EB", icon:"bi-image"},
    {id:2, name:"Product Launch Video", type:"video", ext:"MP4", category:"Videos", tags:["launch","product","2026"], date:"2026-06-24", by:"Karan Mehta", size:"186 MB", visibility:"Private", downloads:87, color:"#8B5CF6", icon:"bi-camera-reels"},
    {id:3, name:"Instagram Post - Diwali Sale", type:"image", ext:"PNG", category:"Social Media", tags:["instagram","festive","sale"], date:"2026-06-22", by:"Sana Iqbal", size:"1.1 MB", visibility:"Public", downloads:342, color:"#F59E0B", icon:"bi-image"},
    {id:4, name:"Facebook Ad - Retargeting Q3", type:"image", ext:"JPG", category:"Social Media", tags:["facebook","ads","q3"], date:"2026-06-20", by:"Aditi Rao", size:"0.8 MB", visibility:"Public", downloads:158, color:"#0EA5E9", icon:"bi-image"},
    {id:5, name:"Brand Guidelines 2026", type:"document", ext:"PDF", category:"Brand Assets", tags:["branding","guidelines"], date:"2026-06-15", by:"Rohan Shah", size:"14.2 MB", visibility:"Private", downloads:63, color:"#EF4444", icon:"bi-file-earmark-pdf"},
    {id:6, name:"Company Logo Pack", type:"image", ext:"ZIP", category:"Brand Assets", tags:["logo","vector","svg"], date:"2026-06-12", by:"Rohan Shah", size:"6.7 MB", visibility:"Public", downloads:489, color:"#16A34A", icon:"bi-file-earmark-zip"},
    {id:7, name:"Brochure - Enterprise Suite", type:"document", ext:"PDF", category:"Sales Collateral", tags:["brochure","enterprise"], date:"2026-06-10", by:"Meera Nair", size:"9.3 MB", visibility:"Public", downloads:121, color:"#EF4444", icon:"bi-file-earmark-pdf"},
    {id:8, name:"Q2 Marketing Presentation", type:"document", ext:"PPTX", category:"Reports", tags:["quarterly","presentation"], date:"2026-06-08", by:"Karan Mehta", size:"22.5 MB", visibility:"Private", downloads:44, color:"#F59E0B", icon:"bi-file-earmark-slides"},
    {id:9, name:"Website Hero Illustration", type:"image", ext:"SVG", category:"Web Assets", tags:["hero","illustration","web"], date:"2026-06-05", by:"Sana Iqbal", size:"0.4 MB", visibility:"Public", downloads:97, color:"#2563EB", icon:"bi-image"},
    {id:10, name:"Customer Testimonial Reel", type:"video", ext:"MOV", category:"Videos", tags:["testimonial","customers"], date:"2026-06-02", by:"Meera Nair", size:"243 MB", visibility:"Public", downloads:76, color:"#8B5CF6", icon:"bi-camera-reels"},
    {id:11, name:"Email Newsletter Header", type:"image", ext:"PNG", category:"Campaigns", tags:["email","newsletter"], date:"2026-05-29", by:"Aditi Rao", size:"0.6 MB", visibility:"Public", downloads:132, color:"#0EA5E9", icon:"bi-image"},
    {id:12, name:"Podcast Episode 12 - Audio", type:"audio", ext:"MP3", category:"Podcast", tags:["audio","podcast"], date:"2026-05-25", by:"Rohan Shah", size:"38 MB", visibility:"Private", downloads:29, color:"#16A34A", icon:"bi-file-earmark-music"},
    {id:13, name:"Pricing One-Pager", type:"document", ext:"DOCX", category:"Sales Collateral", tags:["pricing","sales"], date:"2026-05-20", by:"Meera Nair", size:"1.3 MB", visibility:"Public", downloads:98, color:"#2563EB", icon:"bi-file-earmark-word"},
    {id:14, name:"Trade Show Banner Design", type:"image", ext:"AI", category:"Campaigns", tags:["tradeshow","print"], date:"2026-05-18", by:"Sana Iqbal", size:"48 MB", visibility:"Private", downloads:22, color:"#F59E0B", icon:"bi-image"},
    {id:15, name:"Explainer Video - Onboarding", type:"video", ext:"MP4", category:"Videos", tags:["onboarding","explainer"], date:"2026-05-14", by:"Karan Mehta", size:"156 MB", visibility:"Public", downloads:203, color:"#8B5CF6", icon:"bi-camera-reels"},
    {id:16, name:"Excel - Campaign Budget Tracker", type:"document", ext:"XLSX", category:"Reports", tags:["budget","tracker"], date:"2026-05-10", by:"Rohan Shah", size:"0.9 MB", visibility:"Private", downloads:31, color:"#16A34A", icon:"bi-file-earmark-excel"}
  ],

  categories:[
    {id:1, name:"Campaigns", description:"Assets for active and past marketing campaigns", total:38},
    {id:2, name:"Social Media", description:"Posts, ads, and stories for social platforms", total:64},
    {id:3, name:"Brand Assets", description:"Logos, guidelines, colors and brand templates", total:22},
    {id:4, name:"Sales Collateral", description:"Brochures, one-pagers and pitch material", total:19},
    {id:5, name:"Videos", description:"Product, testimonial and explainer videos", total:27},
    {id:6, name:"Web Assets", description:"Illustrations, icons and hero graphics for web", total:33},
    {id:7, name:"Reports", description:"Internal presentations and performance reports", total:15},
    {id:8, name:"Podcast", description:"Audio episodes and show notes", total:8}
  ],

  users:[
    {id:1, name:"Aditi Rao", email:"aditi.rao@brightwave-marketing.com", role:"Admin", status:"Active", avatar:"https://i.pravatar.cc/150?img=47", assets:142},
    {id:2, name:"Karan Mehta", email:"karan.mehta@brightwave-marketing.com", role:"Marketing Manager", status:"Active", avatar:"https://i.pravatar.cc/150?img=12", assets:98},
    {id:3, name:"Sana Iqbal", email:"sana.iqbal@brightwave-marketing.com", role:"Team Member", status:"Active", avatar:"https://i.pravatar.cc/150?img=32", assets:76},
    {id:4, name:"Rohan Shah", email:"rohan.shah@brightwave-marketing.com", role:"Team Member", status:"Inactive", avatar:"https://i.pravatar.cc/150?img=51", assets:54},
    {id:5, name:"Meera Nair", email:"meera.nair@brightwave-marketing.com", role:"Marketing Manager", status:"Active", avatar:"https://i.pravatar.cc/150?img=25", assets:63},
    {id:6, name:"Vikram Desai", email:"vikram.desai@brightwave-marketing.com", role:"Team Member", status:"Pending", avatar:"https://i.pravatar.cc/150?img=15", assets:0}
  ],

  activity:[
    {id:1, user:"Aditi Rao", action:"uploaded", target:"Summer Campaign Banner", time:"2026-07-07 09:14", icon:"bi-cloud-upload", color:"blue"},
    {id:2, user:"Karan Mehta", action:"downloaded", target:"Product Launch Video", time:"2026-07-07 08:52", icon:"bi-cloud-download", color:"green"},
    {id:3, user:"Sana Iqbal", action:"shared", target:"Instagram Post - Diwali Sale", time:"2026-07-06 17:41", icon:"bi-share", color:"purple"},
    {id:4, user:"Rohan Shah", action:"edited metadata for", target:"Brand Guidelines 2026", time:"2026-07-06 15:20", icon:"bi-pencil-square", color:"amber"},
    {id:5, user:"Meera Nair", action:"created category", target:"Sales Collateral", time:"2026-07-06 11:03", icon:"bi-folder-plus", color:"cyan"},
    {id:6, user:"Aditi Rao", action:"deleted", target:"Old Banner Draft v1", time:"2026-07-05 18:47", icon:"bi-trash", color:"red"},
    {id:7, user:"Karan Mehta", action:"invited", target:"Vikram Desai to the workspace", time:"2026-07-05 14:12", icon:"bi-person-plus", color:"blue"},
    {id:8, user:"Sana Iqbal", action:"uploaded", target:"Website Hero Illustration", time:"2026-07-04 10:29", icon:"bi-cloud-upload", color:"blue"}
  ],

  monthlyUploads:[
    {label:"Jan", value:120}, {label:"Feb", value:145}, {label:"Mar", value:132},
    {label:"Apr", value:168}, {label:"May", value:190}, {label:"Jun", value:224}, {label:"Jul", value:96}
  ],

  categoryDistribution:[
    {label:"Campaigns", value:38, color:"#2563EB"},
    {label:"Social Media", value:64, color:"#3B82F6"},
    {label:"Brand Assets", value:22, color:"#8B5CF6"},
    {label:"Sales Collateral", value:19, color:"#F59E0B"},
    {label:"Videos", value:27, color:"#16A34A"},
    {label:"Web Assets", value:33, color:"#0EA5E9"}
  ],

  storage:{ used: 214, total: 500, unit: "GB" }
};

// icon + color helpers for file types
function damFileMeta(ext){
  const map = {
    JPG:{icon:"bi-image", color:"#2563EB"}, PNG:{icon:"bi-image", color:"#0EA5E9"}, SVG:{icon:"bi-image", color:"#2563EB"},
    MP4:{icon:"bi-camera-reels", color:"#8B5CF6"}, MOV:{icon:"bi-camera-reels", color:"#8B5CF6"},
    PDF:{icon:"bi-file-earmark-pdf", color:"#EF4444"}, DOCX:{icon:"bi-file-earmark-word", color:"#2563EB"},
    PPTX:{icon:"bi-file-earmark-slides", color:"#F59E0B"}, XLSX:{icon:"bi-file-earmark-excel", color:"#16A34A"},
    ZIP:{icon:"bi-file-earmark-zip", color:"#16A34A"}, MP3:{icon:"bi-file-earmark-music", color:"#16A34A"},
    AI:{icon:"bi-vector-pen", color:"#F59E0B"}
  };
  return map[ext] || {icon:"bi-file-earmark", color:"#64748B"};
}
