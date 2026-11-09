/* Hexdump-style terminal emulator + theme switcher (original implementation). */
(function () {
  "use strict";

  var THEMES = ["matrix", "dracula", "nord", "gruvbox", "mono"];
  var PAGER = "rob@what-security";
  var DATA = {
    whoami: {
      name: "Robbie Wiggins",
      role: "bug bounty hunter & vulnerability researcher",
      email: "rob@what-security.co.uk",
      handle: "txt3rob (HackerOne / Bugcrowd)",
      since: "2016",
      status: "HUNTING"
    },
    files: {
      "disclosures.txt": [
        "2026-10-30  applebees.app        hardcoded-db-password -> customer PII   [FIXED]",
        "2019-08-29  jira                 private-server-keys-exposure            [FIXED]",
        "2019-04-15  honda-india          50,000 customers on public s3 bucket    [FIXED]",
        "2019-03-10  honda-connect        50,000+ users' personal information     [FIXED]",
        "2018-12-06  kubernetes           clusters hijacked worldwide             [FIXED]",
        "2018-05-21  teen-tracking-app    thousands of user details exposed       [FIXED]",
        "2018-01-31  aws-tipoff           exposed storage alert service (BBC)     [LIVE]"
      ].join("\n"),
      "cli-tips.txt": [
        "nmap -sV --script vuln target.local        # quick vulnerability sweep",
        "nmap -p- --min-rate 5000 target.local      # full port range, fast",
        "wpscan --url target.tld --enumerate vp     # wordpress plugin vulns",
        "kubectl get pods -A | grep -i default      # find default-namespace pods",
        "see /cli/ for the full set"
      ].join("\n"),
      "contact.txt": [
        "email      rob@what-security.co.uk",
        "hackerone  https://hackerone.com/txt3rob",
        "bugcrowd   https://bugcrowd.com/txt3rob",
        "github     https://github.com/random-robbie",
        "twitter    @random_robbie"
      ].join("\n")
    },
    skills: [
      "web application security (owasp top 10)",
      "network infrastructure assessment",
      "cloud security: aws / azure / gcp",
      "docker & kubernetes",
      "api security",
      "mobile application security"
    ],
    hints: ["help", "whoami", "ls", "cat disclosures.txt", "skills", "contact", "theme gruvbox", "clear"]
  };

  /* ---- theme switching -------------------------------------------------- */

  function setTheme(name) {
    if (THEMES.indexOf(name) === -1) return false;
    document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem("ws-theme", name); } catch (e) {}
    var dots = document.querySelectorAll(".theme-dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", dots[i].getAttribute("data-theme") === name);
    }
    return true;
  }

  var saved = null;
  try { saved = localStorage.getItem("ws-theme"); } catch (e) {}
  setTheme(THEMES.indexOf(saved) !== -1 ? saved : "matrix");

  var dots = document.querySelectorAll(".theme-dot");
  for (var d = 0; d < dots.length; d++) {
    dots[d].addEventListener("click", function () {
      setTheme(this.getAttribute("data-theme"));
      if (termBody) print("theme set: " + this.getAttribute("data-theme"), "t-ok");
    });
  }

  /* ---- terminal ---------------------------------------------------------- */

  var termBody = null;
  var termInput = null;

  function print(text, cls) {
    var div = document.createElement("div");
    div.className = cls || "t-out";
    div.textContent = text;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function printWhoami() {
    var w = DATA.whoami;
    var lines = [
      ["name", w.name], ["role", w.role], ["email", w.email],
      ["handle", w.handle], ["since", w.since], ["status", w.status]
    ];
    for (var i = 0; i < lines.length; i++) {
      var row = document.createElement("div");
      var k = document.createElement("span");
      k.className = "t-key";
      k.textContent = lines[i][0] + ":  ";
      var v = document.createElement("span");
      v.className = "t-cmd";
      v.textContent = lines[i][1];
      row.appendChild(k);
      row.appendChild(v);
      termBody.appendChild(row);
    }
    termBody.scrollTop = termBody.scrollHeight;
  }

  function command(input) {
    var parts = input.trim().split(/\s+/);
    var cmd = (parts[0] || "").toLowerCase();
    var arg = parts.slice(1).join(" ").toLowerCase();
    if (!cmd) return;
    print(PAGER + " ~ $ " + input, "t-cmd");
    switch (cmd) {
      case "help":
        print("available commands:", "t-ok");
        print("  whoami              who is robbie");
        print("  ls                  list files");
        print("  cat <file>          print a file (try: disclosures.txt, cli-tips.txt, contact.txt)");
        print("  skills              capability list");
        print("  projects            top GitHub repositories");
        print("  media               recent press coverage");
        print("  theme <name>        " + THEMES.join(" | "));
        print("  contact             how to reach me");
        print("  clear               clear the screen");
        break;
      case "whoami":
        printWhoami();
        break;
      case "ls":
        print(Object.keys(DATA.files).join("   ") + "   about.md", "t-ok");
        break;
      case "projects":
        print("top repositories (github.com/random-robbie):", "t-ok");
        print("  bruteforce-lists    1,448 stars   wordlists for brute-forcing");
        print("  My-Shodan-Scripts   1,158 stars   shodan search scripts");
        print("  keywords              377 stars   exposed secret keyword lists");
        print("  bugbounty-scans       311 stars   aquatone recon results");
        print("  Jira-Scan             193 stars   CVE-2017-9506 SSRF scanner");
        print("  full list: /projects/");
        break;
      case "cat":
        if (DATA.files[arg]) print(DATA.files[arg]);
        else if (arg === "about.md") print("see /about/ — or run: whoami");
        else print("cat: " + (arg || "?") + ": no such file. try: ls", "t-key");
        break;
      case "skills":
        print(DATA.skills.join("\n"), "t-ok");
        break;
      case "media":
        print("recent coverage:", "t-ok");
        print("  [techcrunch] applebee's exposed customers' personal data (2026)");
        print("  [zdnet]      jira bug exposed private server keys (2019)");
        print("  [bbc]        exposed aws storage tip-off alerts (2018)");
        print("  full list: /media/");
        break;
      case "contact":
        print(DATA.files["contact.txt"], "t-ok");
        break;
      case "theme":
        if (setTheme(arg)) print("theme set: " + arg, "t-ok");
        else print("usage: theme <" + THEMES.join("|") + ">", "t-key");
        break;
      case "clear":
        termBody.innerHTML = "";
        break;
      case "sudo":
        print("nice try. permission denied :)", "t-key");
        break;
      case "date":
        print(new Date().toString());
        break;
      case "echo":
        print(parts.slice(1).join(" "));
        break;
      default:
        print(cmd + ": command not found. try: help", "t-key");
    }
  }

  function initTerminal() {
    termBody = document.getElementById("term-body");
    termInput = document.getElementById("term-input");
    if (!termBody || !termInput) return;

    print("welcome to what-security.", "t-ok");
    print("type a command and press [ENTER], or try: help");
    print("");

    termInput.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var val = termInput.value;
      termInput.value = "";
      command(val);
    });

    // Click anywhere on the terminal focuses the prompt.
    var term = document.querySelector(".terminal");
    if (term) {
      term.addEventListener("click", function () { termInput.focus(); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTerminal);
  } else {
    initTerminal();
  }
})();
