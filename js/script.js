/* ============================================================
   Salesforce CRM Clone — application script
   Scope: login-main only, plus the minimum shared SPA/state
   infrastructure required for login-main.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- localStorage keys ----------
     Only keys defined in SCREEN_MAP.md / explicitly approved:
       - sfclone_remember_me  (approved: Remember Me persists in localStorage)
       - sfclone_active_screen (SCREEN_MAP: "Store active screen in localStorage")
       - sfclone_auth          (SCREEN_MAP: "Store fake authenticated state") */
  var LS = {
    REMEMBER: "sfclone_remember_me",
    ACTIVE_SCREEN: "sfclone_active_screen",
    AUTH: "sfclone_auth"
  };

  /* ---------- Router (hash-driven SPA infra) ----------
     window.location.hash is the primary navigation source of truth.
     sfclone_active_screen is kept as secondary saved state only. */
  var Router = {
    isBuilt: function (screen) {
      var el = document.getElementById("screen-" + screen);
      return !!(el && el.children.length > 0);
    },
    hashScreen: function () {
      return (window.location.hash || "").replace(/^#/, "");
    },
    render: function (screen) {
      /* Only display built screens. Blank shells / unknown names fall back to
         login-main so navigation never lands on an empty white screen. */
      if (!this.isBuilt(screen)) screen = "login-main";
      var sections = document.querySelectorAll(".screen");
      for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove("active");
      }
      document.getElementById("screen-" + screen).classList.add("active");
      localStorage.setItem(LS.ACTIVE_SCREEN, screen);
    },
    renderFromHash: function () {
      var screen = this.hashScreen();
      this.render(screen && this.isBuilt(screen) ? screen : "login-main");
    },
    navigate: function (screen) {
      /* Update the hash only for built screens. Changing the hash creates a
         browser history entry and triggers the hashchange -> renderFromHash
         flow. If the hash already matches, render directly so the screen still
         shows. Unbuilt targets are ignored (no hash change, no blank screen). */
      if (!this.isBuilt(screen)) return;
      if (this.hashScreen() === screen) {
        this.render(screen);
      } else {
        window.location.hash = screen;
      }
    }
  };

  /* ---------- Inline notice helper ----------
     Used only for the approved Privacy message. */
  var Notice = {
    el: null,
    init: function () { this.el = document.getElementById("login-notice"); },
    show: function (message) {
      if (!this.el) return;
      this.el.textContent = message;
      this.el.hidden = false;
    },
    clear: function () {
      if (!this.el) return;
      this.el.hidden = true;
      this.el.textContent = "";
    }
  };

  /* ---------- Remember me persistence (approved) ---------- */
  function persistRememberMe() {
    var remember = document.getElementById("remember-me").checked;
    localStorage.setItem(LS.REMEMBER, remember ? "true" : "false");
  }

  function restoreRememberMe() {
    document.getElementById("remember-me").checked =
      localStorage.getItem(LS.REMEMBER) === "true";
  }

  /* ---------- Init ---------- */
  function init() {
    Notice.init();

    /* Primary navigation source is window.location.hash. Render from the hash
       first; fall back to login-main for missing/invalid/blank-shell hashes. */
    Router.renderFromHash();
    window.addEventListener("hashchange", function () { Router.renderFromHash(); });

    restoreRememberMe();

    document.getElementById("remember-me").addEventListener("change", persistRememberMe);

    /* Privacy link — approved inline message. */
    document.getElementById("privacy-link").addEventListener("click", function (e) {
      e.preventDefault();
      Notice.show("Not part of this prototype.");
    });

    /* Log In (SCREEN_MAP): empty username/password -> red border only (no text);
       both filled -> set fake auth + route to home-dashboard. */
    document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var u = document.getElementById("username");
      var p = document.getElementById("password");
      var invalid = false;
      if (!u.value.trim()) { u.classList.add("invalid"); invalid = true; } else { u.classList.remove("invalid"); }
      if (!p.value) { p.classList.add("invalid"); invalid = true; } else { p.classList.remove("invalid"); }
      if (invalid) return;
      localStorage.setItem(LS.AUTH, "true");
      Router.navigate("home-dashboard");
    });

    /* Forgot password — Continue (SCREEN_MAP): empty username -> red border only
       (no text); filled username -> show approved inline confirmation text. */
    var forgotForm = document.getElementById("forgot-form");
    if (forgotForm) {
      forgotForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var fu = document.getElementById("fp-username");
        var notice = document.getElementById("fp-notice");
        if (!fu.value.trim()) {
          fu.classList.add("invalid");
          if (notice) { notice.hidden = true; notice.textContent = ""; }
          return;
        }
        fu.classList.remove("invalid");
        if (notice) {
          notice.textContent = "Check your email for password reset instructions.";
          notice.hidden = false;
        }
      });
    }

    /* Use email address — Continue (SCREEN_MAP): empty email -> red border only
       (no text); filled email -> show approved inline confirmation text. */
    var emailForm = document.getElementById("email-form");
    if (emailForm) {
      var ueNotice = document.getElementById("ue-notice");
      emailForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var em = document.getElementById("ue-email");
        if (!em.value.trim()) {
          em.classList.add("invalid");
          if (ueNotice) { ueNotice.hidden = true; ueNotice.textContent = ""; }
          return;
        }
        em.classList.remove("invalid");
        if (ueNotice) {
          ueNotice.textContent = "Check your email for password reset instructions.";
          ueNotice.hidden = false;
        }
      });

      /* Privacy link — same approved inline message as login-main. */
      var uePrivacy = document.getElementById("ue-privacy-link");
      if (uePrivacy) {
        uePrivacy.addEventListener("click", function (e) {
          e.preventDefault();
          if (ueNotice) {
            ueNotice.textContent = "Not part of this prototype.";
            ueNotice.hidden = false;
          }
        });
      }
    }

    /* Custom domain — Continue (SCREEN_MAP): empty domain -> red border only
       (no text); filled domain -> show approved inline confirmation text. */
    var domainForm = document.getElementById("domain-form");
    if (domainForm) {
      var cdNotice = document.getElementById("cd-notice");
      domainForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var cd = document.getElementById("cd-domain");
        if (!cd.value.trim()) {
          cd.classList.add("invalid");
          if (cdNotice) { cdNotice.hidden = true; cdNotice.textContent = ""; }
          return;
        }
        cd.classList.remove("invalid");
        if (cdNotice) {
          cdNotice.textContent = "Custom domain submitted.";
          cdNotice.hidden = false;
        }
      });

      /* Privacy link — same approved inline message as login-main. */
      var cdPrivacy = document.getElementById("cd-privacy-link");
      if (cdPrivacy) {
        cdPrivacy.addEventListener("click", function (e) {
          e.preventDefault();
          if (cdNotice) {
            cdNotice.textContent = "Not part of this prototype.";
            cdNotice.hidden = false;
          }
        });
      }
    }

    /* Free CRM signup — Next (SCREEN_MAP): empty required fields -> red border
       only (no text); all filled -> set fake auth + route to home-dashboard. */
    var signupForm = document.getElementById("signup-form");
    if (signupForm) {
      var fcNotice = document.getElementById("fc-notice");
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var ids = ["fc-first", "fc-last", "fc-job"];
        var invalid = false;
        for (var k = 0; k < ids.length; k++) {
          var f = document.getElementById(ids[k]);
          if (!f.value.trim()) { f.classList.add("invalid"); invalid = true; }
          else { f.classList.remove("invalid"); }
        }
        if (invalid) return;
        localStorage.setItem(LS.AUTH, "true");
        Router.navigate("home-dashboard");
      });

      /* Login button toggles the dropdown (no navigation). */
      var loginBtn = document.getElementById("fc-login-btn");
      var dropdown = document.getElementById("fc-dropdown");
      if (loginBtn && dropdown) {
        loginBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.hidden = !dropdown.hidden;
        });
        document.addEventListener("click", function () {
          if (!dropdown.hidden) dropdown.hidden = true;
        });
      }

      /* Ask Agentforce + Free Suite — approved inline notice only. */
      var agentBtn = document.getElementById("fc-agentforce");
      if (agentBtn) {
        agentBtn.addEventListener("click", function () {
          if (fcNotice) {
            fcNotice.textContent = "Not part of this prototype.";
            fcNotice.hidden = false;
          }
        });
      }
      var freeSuite = document.getElementById("fc-freesuite");
      if (freeSuite) {
        freeSuite.addEventListener("click", function (e) {
          e.preventDefault();
          if (fcNotice) {
            fcNotice.textContent = "Not part of this prototype.";
            fcNotice.hidden = false;
          }
        });
      }
    }

    /* ---------- Home dashboard ---------- */
    var hdApp = document.getElementById("screen-home-dashboard");
    if (hdApp && hdApp.children.length > 0) {
      /* Approved inline notice for all controls without a defined destination. */
      var hdToast = document.getElementById("hd-toast");
      var hdToastTimer = null;
      function hdShowNotice() {
        if (!hdToast) return;
        hdToast.textContent = "Not part of this prototype.";
        hdToast.hidden = false;
        if (hdToastTimer) clearTimeout(hdToastTimer);
        hdToastTimer = setTimeout(function () { hdToast.hidden = true; }, 2200);
      }
      var hdNoticeEls = hdApp.querySelectorAll(".hd-notice");
      for (var n = 0; n < hdNoticeEls.length; n++) {
        hdNoticeEls[n].addEventListener("click", function (e) {
          e.preventDefault();
          hdShowNotice();
        });
      }

      /* Suggestion card X buttons hide their own card (approved). */
      var hdX = hdApp.querySelectorAll(".hd-sug-x");
      for (var x = 0; x < hdX.length; x++) {
        hdX[x].addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var card = this.closest(".hd-sug");
          if (card) card.style.display = "none";
        });
      }

      /* Welcome banner chevron collapses/expands the banner (approved). */
      var hdBannerToggle = document.getElementById("hd-banner-toggle");
      var hdWelcome = document.getElementById("hd-welcome");
      if (hdBannerToggle && hdWelcome) {
        hdBannerToggle.addEventListener("click", function (e) {
          e.preventDefault();
          hdWelcome.classList.toggle("hd-collapsed");
        });
      }

      /* Profile button toggles a small menu containing Logout only (approved). */
      var hdProfileBtn = document.getElementById("hd-profile-btn");
      var hdProfileMenu = document.getElementById("hd-profile-menu");
      if (hdProfileBtn && hdProfileMenu) {
        hdProfileBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          hdProfileMenu.hidden = !hdProfileMenu.hidden;
        });
        document.addEventListener("click", function () {
          if (!hdProfileMenu.hidden) hdProfileMenu.hidden = true;
        });
      }

      /* Logout (SCREEN_MAP) -> clear fake auth + route to login-main. */
      var hdLogout = document.getElementById("hd-logout");
      if (hdLogout) {
        hdLogout.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem(LS.AUTH);
          Router.navigate("login-main");
        });
      }
    }

    /* ---------- Accounts list view ---------- */
    var acApp = document.getElementById("screen-accounts");
    if (acApp && acApp.children.length > 0) {
      /* Approved inline notice for all undefined modals/toolbar/list controls. */
      var acToast = document.getElementById("ac-toast");
      var acToastTimer = null;
      function acShowNotice() {
        if (!acToast) return;
        acToast.textContent = "Not part of this prototype.";
        acToast.hidden = false;
        if (acToastTimer) clearTimeout(acToastTimer);
        acToastTimer = setTimeout(function () { acToast.hidden = true; }, 2200);
      }
      var acNoticeEls = acApp.querySelectorAll(".hd-notice");
      for (var a = 0; a < acNoticeEls.length; a++) {
        acNoticeEls[a].addEventListener("click", function (e) {
          e.preventDefault();
          acShowNotice();
        });
      }

      /* Profile button toggles a small menu containing Logout only. */
      var acProfileBtn = document.getElementById("ac-profile-btn");
      var acProfileMenu = document.getElementById("ac-profile-menu");
      if (acProfileBtn && acProfileMenu) {
        acProfileBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          acProfileMenu.hidden = !acProfileMenu.hidden;
        });
        document.addEventListener("click", function () {
          if (!acProfileMenu.hidden) acProfileMenu.hidden = true;
        });
      }

      /* Logout (SCREEN_MAP) -> clear fake auth + route to login-main. */
      var acLogout = document.getElementById("ac-logout");
      if (acLogout) {
        acLogout.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem(LS.AUTH);
          Router.navigate("login-main");
        });
      }
    }

    /* ---------- Leads list view ---------- */
    var ldApp = document.getElementById("screen-leads");
    if (ldApp && ldApp.children.length > 0) {
      /* Approved inline notice for all undefined modals/toolbar/list/tab controls. */
      var ldToast = document.getElementById("ld-toast");
      var ldToastTimer = null;
      function ldShowNotice() {
        if (!ldToast) return;
        ldToast.textContent = "Not part of this prototype.";
        ldToast.hidden = false;
        if (ldToastTimer) clearTimeout(ldToastTimer);
        ldToastTimer = setTimeout(function () { ldToast.hidden = true; }, 2200);
      }
      var ldNoticeEls = ldApp.querySelectorAll(".hd-notice");
      for (var l = 0; l < ldNoticeEls.length; l++) {
        ldNoticeEls[l].addEventListener("click", function (e) {
          e.preventDefault();
          ldShowNotice();
        });
      }

      /* Profile button toggles a small menu containing Logout only. */
      var ldProfileBtn = document.getElementById("ld-profile-btn");
      var ldProfileMenu = document.getElementById("ld-profile-menu");
      if (ldProfileBtn && ldProfileMenu) {
        ldProfileBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          ldProfileMenu.hidden = !ldProfileMenu.hidden;
        });
        document.addEventListener("click", function () {
          if (!ldProfileMenu.hidden) ldProfileMenu.hidden = true;
        });
      }

      /* Logout (SCREEN_MAP) -> clear fake auth + route to login-main. */
      var ldLogout = document.getElementById("ld-logout");
      if (ldLogout) {
        ldLogout.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem(LS.AUTH);
          Router.navigate("login-main");
        });
      }
    }

    /* ---------- Cases list view ---------- */
    var csApp = document.getElementById("screen-cases");
    if (csApp && csApp.children.length > 0) {
      /* Approved inline notice for all undefined modals/toolbar/list/tab controls. */
      var csToast = document.getElementById("cs-toast");
      var csToastTimer = null;
      function csShowNotice() {
        if (!csToast) return;
        csToast.textContent = "Not part of this prototype.";
        csToast.hidden = false;
        if (csToastTimer) clearTimeout(csToastTimer);
        csToastTimer = setTimeout(function () { csToast.hidden = true; }, 2200);
      }
      var csNoticeEls = csApp.querySelectorAll(".hd-notice");
      for (var c = 0; c < csNoticeEls.length; c++) {
        csNoticeEls[c].addEventListener("click", function (e) {
          e.preventDefault();
          csShowNotice();
        });
      }

      /* Profile button toggles a small menu containing Logout only. */
      var csProfileBtn = document.getElementById("cs-profile-btn");
      var csProfileMenu = document.getElementById("cs-profile-menu");
      if (csProfileBtn && csProfileMenu) {
        csProfileBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          csProfileMenu.hidden = !csProfileMenu.hidden;
        });
        document.addEventListener("click", function () {
          if (!csProfileMenu.hidden) csProfileMenu.hidden = true;
        });
      }

      /* Logout (SCREEN_MAP) -> clear fake auth + route to login-main. */
      var csLogout = document.getElementById("cs-logout");
      if (csLogout) {
        csLogout.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem(LS.AUTH);
          Router.navigate("login-main");
        });
      }
    }

    /* SCREEN_MAP navigation routes (destinations may currently be blank shells). */
    var routeEls = document.querySelectorAll("[data-route]");
    for (var i = 0; i < routeEls.length; i++) {
      routeEls[i].addEventListener("click", function (e) {
        e.preventDefault();
        Router.navigate(this.getAttribute("data-route"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
