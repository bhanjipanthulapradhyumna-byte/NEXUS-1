const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = {
  loggedIn: localStorage.getItem("nexusLoggedIn") === "true",
  loginType: localStorage.getItem("nexusLoginType") || "",
  email: localStorage.getItem("nexusEmail") || "",
  privacy: localStorage.getItem("nexusPrivacy") === "true",
  theme: localStorage.getItem("nexusTheme") || "dark",
  accent: localStorage.getItem("nexusAccent") || "#8b5cf6",
  fontSize: localStorage.getItem("nexusFontSize") || "100%",
  font: localStorage.getItem("nexusFont") || "Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
};

const heroTitles = {
  home:"WELCOME TO NEXUS",
  new:"WELCOME TO NEXUS",
  research:"Start a research",
  finance:"Start a trade",
  problem:"Start a chat to clarify your doubt",
  coding:"Start a code",
  analysis:"Start to analyse"
};

function applyPrefs(){
  document.documentElement.style.setProperty("--purple", state.accent);
  document.documentElement.style.setProperty("--font", state.font);
  document.body.style.fontSize = state.fontSize;
}
applyPrefs();

setTimeout(()=>$("#app").classList.remove("hidden"), 900);

function updateAuthUI(){
  $("#loginBtn").classList.toggle("hidden", state.loggedIn);
  $("#profileBtn").classList.toggle("hidden", !state.loggedIn);
  $("#privacyBtn").classList.toggle("hidden", !state.loggedIn);
  $("#privacyBanner").classList.toggle("hidden", !state.privacy);
  if(state.loggedIn) $("#privacyBtn").textContent = state.privacy ? "◉" : "◌";
}
updateAuthUI();

function setPage(tool="home"){
  $("#settingsPage").classList.add("hidden");
  $("#chatPage").classList.remove("hidden");
  $("#heroTitle").textContent = heroTitles[tool] || heroTitles.home;
  closePanel();
}
function openPanel(){ $("#sidePanel").classList.add("open"); $("#overlay").classList.add("open"); }
function closePanel(){ $("#sidePanel").classList.remove("open"); $("#overlay").classList.remove("open"); }

$("#menuBtn").onclick = openPanel;
$("#closePanel").onclick = closePanel;
$("#overlay").onclick = closePanel;
$$("[data-action='home']").forEach(b=>b.onclick=()=>setPage("home"));

$$("[data-tool]").forEach(btn=>{
  btn.onclick=()=>{
    const tool=btn.dataset.tool;
    if(tool==="settings"){ openSettings(); return; }
    if(tool==="help"){ showHelp(); return; }
    setPage(tool);
  };
});

function showModal(html){
  $("#modal").innerHTML=html;
  $("#modalLayer").classList.remove("hidden");
}
function closeModal(){ $("#modalLayer").classList.add("hidden"); $("#modal").innerHTML=""; }
$("#modalLayer").addEventListener("click",e=>{ if(e.target.id==="modalLayer") closeModal(); });

$("#loginBtn").onclick=()=>showLoginChooser();

function modalHeader(title,subtitle=""){
 return `<button class="modal-close" data-close>×</button><h2>${title}</h2><p>${subtitle}</p>`;
}
function bindClose(){ const x=$("[data-close]"); if(x)x.onclick=closeModal; }

function showLoginChooser(){
 showModal(`${modalHeader("Login to NEXUS","Choose how you want to continue.")}
   <button class="account" id="googleChoice"><span class="avatar">G</span><span>Continue with Google</span></button>
   <button class="account" id="emailChoice"><span class="avatar">@</span><span>Continue with email</span></button>`);
 bindClose();
 $("#googleChoice").onclick=showGoogleAccounts;
 $("#emailChoice").onclick=showEmailStep;
}
function showGoogleAccounts(){
 showModal(`${modalHeader("Choose a Google account","Select an account or add another account.")}
 <div class="account-list">
  <button class="account google-account" data-email="alex@example.com"><span class="avatar">A</span><span><b>Alex User</b><small>alex@example.com</small></span></button>
  <button class="account google-account" data-email="demo@example.com"><span class="avatar">D</span><span><b>Demo User</b><small>demo@example.com</small></span></button>
  <button class="account" id="addGoogle"><span class="avatar">＋</span><span>Add another account</span></button>
 </div>`);
 bindClose();
 $$(".google-account").forEach(b=>b.onclick=()=>showTerms("Google",b.dataset.email));
 $("#addGoogle").onclick=()=>showModal(`${modalHeader("Add Google account","This demo opens the account-selection flow. Connect Google OAuth in the backend before production use.")}<div class="modal-actions"><button class="cancel" data-close>Cancel</button><button class="continue" id="demoAdd">Continue</button></div>`);
 bindClose();
 $("#demoAdd")?.addEventListener("click",()=>showTerms("Google","new-account@example.com"));
}
function showEmailStep(){
 showModal(`${modalHeader("Email login","Enter your email address.")}
 <input id="emailField" type="email" placeholder="you@example.com" autocomplete="email" />
 <div class="modal-actions"><button class="cancel" data-close>Cancel</button><button class="continue" id="emailContinue">Continue</button></div>`);
 bindClose();
 $("#emailContinue").onclick=()=>{
   const email=$("#emailField").value.trim();
   if(!email || !email.includes("@")) return toast("Enter a valid email address.");
   showPasswordStep(email);
 };
}
function showPasswordStep(email){
 showModal(`${modalHeader("Enter your password",email)}
 <input id="passwordField" type="password" placeholder="Password" autocomplete="current-password" />
 <p class="terms">By continuing, you agree to the NEXUS Terms and Conditions and acknowledge the Privacy Policy.</p>
 <div class="modal-actions"><button class="cancel" data-close>Cancel</button><button class="continue" id="passwordContinue">Continue</button></div>`);
 bindClose();
 $("#passwordContinue").onclick=()=>{
   const pw=$("#passwordField").value;
   if(pw.length<1) return toast("Enter your password.");
   completeLogin("Email",email);
 };
}
function showTerms(type,email){
 showModal(`${modalHeader("Terms & Conditions","Review the NEXUS terms before continuing.")}
 <div class="detail" style="max-height:180px;overflow:auto">NEXUS provides an AI interface. You agree to use the service lawfully, protect your account credentials, and understand that AI responses may contain errors. This demonstration does not perform real Google authentication.</div>
 <p class="terms">Login type: ${type} · Account: ${email}</p>
 <div class="modal-actions"><button class="cancel" data-close>Cancel</button><button class="continue" id="termsContinue">Continue</button></div>`);
 bindClose();
 $("#termsContinue").onclick=()=>completeLogin(type,email);
}
function completeLogin(type,email){
 state.loggedIn=true; state.loginType=type; state.email=email;
 localStorage.setItem("nexusLoggedIn","true"); localStorage.setItem("nexusLoginType",type); localStorage.setItem("nexusEmail",email);
 closeModal(); updateAuthUI(); toast("Login completed.");
}

$("#profileBtn").onclick=()=>{
 showModal(`${modalHeader("Profile","Your NEXUS account details.")}
 <div class="profile-card">
   <div class="detail"><small>Login type</small>${state.loginType}</div>
   <div class="detail"><small>Email</small>${state.email}</div>
   <button class="logout" id="logoutBtn">⇥ Logout</button>
 </div>`);
 bindClose();
 $("#logoutBtn").onclick=()=>{
   state.loggedIn=false;state.loginType="";state.email="";state.privacy=false;
   localStorage.removeItem("nexusLoggedIn");localStorage.removeItem("nexusLoginType");localStorage.removeItem("nexusEmail");localStorage.removeItem("nexusPrivacy");
   closeModal();updateAuthUI();setPage("home");toast("Logged out.");
 };
};

$("#privacyBtn").onclick=()=>{
 state.privacy=!state.privacy;
 localStorage.setItem("nexusPrivacy",String(state.privacy));
 updateAuthUI();
 toast(state.privacy ? "Privacy mode is on." : "Privacy mode is off.");
};

function openSettings(){
 closePanel(); $("#chatPage").classList.add("hidden"); $("#settingsPage").classList.remove("hidden");
}
$$(".settings-row").forEach(b=>b.onclick=()=>showSetting(b.dataset.setting));

function showSetting(type){
 if(type==="personalize"){
  showModal(`${modalHeader("Personalize","Keep NEXUS minimal and adjust only the essentials.")}
   <div class="setting-option"><span>Accent color</span><input id="accent" type="color" value="${state.accent}" style="width:55px;height:34px;padding:2px"></div>
   <div class="setting-option"><span>Font</span><select id="font"><option value="Inter,ui-sans-serif,system-ui,sans-serif">Inter / System</option><option value="Georgia,serif">Georgia</option><option value="Arial,sans-serif">Arial</option><option value="'Courier New',monospace">Monospace</option></select></div>
   <div class="setting-option"><span>Font size</span><select id="fontSize"><option value="90%">90%</option><option value="100%">100%</option><option value="110%">110%</option><option value="120%">120%</option></select></div>
   <div class="modal-actions"><button class="cancel" data-close>Close</button><button class="continue" id="savePersonal">Save</button></div>`);
  bindClose(); $("#font").value=state.font;$("#fontSize").value=state.fontSize;
  $("#savePersonal").onclick=()=>{state.accent=$("#accent").value;state.font=$("#font").value;state.fontSize=$("#fontSize").value;localStorage.setItem("nexusAccent",state.accent);localStorage.setItem("nexusFont",state.font);localStorage.setItem("nexusFontSize",state.fontSize);applyPrefs();closeModal();toast("Personalization saved.");};
 } else if(type==="appearance"){
  showModal(`${modalHeader("Appearance","Choose the visual mode.")}
   <div class="setting-option"><span>Theme</span><select id="theme"><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></div>
   <p class="terms">NEXUS is designed around a black interface; light mode is provided as an optional appearance setting.</p>
   <div class="modal-actions"><button class="cancel" data-close>Cancel</button><button class="continue" id="saveTheme">Save</button></div>`);
  bindClose();$("#theme").value=state.theme;
  $("#saveTheme").onclick=()=>{state.theme=$("#theme").value;localStorage.setItem("nexusTheme",state.theme);toast("Appearance saved. Theme styling can be extended in the production build.");closeModal();};
 } else if(type==="general"){
  showModal(`${modalHeader("General","Basic application settings.")}
   <div class="detail">Language: English</div><div class="detail" style="margin-top:8px">Chat history: Stored locally in this demo</div>
   <div class="modal-actions"><button class="cancel" data-close>Close</button></div>`);
  bindClose();
 } else {
  showModal(`${modalHeader("About NEXUS","AI workspace interface")}
   <div class="detail">NEXUS is a front-end prototype with navigation, login-flow simulation, image attachment handling, microphone access, privacy mode, profile state and settings.</div>
   <div class="modal-actions"><button class="cancel" data-close>Close</button></div>`);
  bindClose();
 }
}
function showHelp(){
 showModal(`${modalHeader("Help","Quick guidance for the NEXUS interface.")}
 <div class="detail">Use the bottom composer to type a message. The gallery icon accepts image files only. The microphone icon requests microphone access. Use the menu for research, finance, problem solving, coding, analysis and settings.</div>
 <div class="modal-actions"><button class="cancel" data-close>Close</button></div>`);
 bindClose();
}

$("#imageInput").onchange=e=>{
 const file=e.target.files[0]; if(!file)return;
 if(!file.type.startsWith("image/")){toast("Only image attachments are accepted.");e.target.value="";return;}
 $("#attachmentPreview").textContent=`Attached image: ${file.name}`;
 $("#attachmentPreview").classList.remove("hidden");
};
$("#micBtn").onclick=async()=>{
 if(!navigator.mediaDevices?.getUserMedia){toast("Microphone access is not supported in this browser.");return;}
 try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});stream.getTracks().forEach(t=>t.stop());toast("Microphone access granted.");}
 catch(e){toast("Microphone permission was denied.");}
};
$("#sendBtn").onclick=()=>{
 const text=$("#promptInput").value.trim();
 if(!text && !$("#imageInput").files.length)return toast("Type a message or attach an image.");
 toast("Input ready for the AI backend.");
};
$("#promptInput").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,140)+"px"});
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2400)}
