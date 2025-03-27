document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ticket-form");
  
  if (form) {
    const uploadInput = document.getElementById("upload-input");
    const uploadContainer = document.querySelector(".upload-container");
    const previewImage = document.getElementById("preview-image");
    const changeBtn = document.querySelector(".change-btn");
    const removeBtn = document.querySelector(".remove-btn");

    function showImagePreview(file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        uploadContainer.classList.add("has-image");
      };
      
      reader.readAsDataURL(file);
    }

    uploadInput.addEventListener("change", function() {
      if (this.files && this.files[0]) {
        if (this.files[0].size > 500 * 1024) {
          alert("A imagem deve ter no máximo 500KB");
          return;
        }
        showImagePreview(this.files[0]);
      }
    });

    if (changeBtn) {
      changeBtn.addEventListener("click", function() {
        uploadInput.click();
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", function() {
        uploadInput.value = "";
        uploadContainer.classList.remove("has-image");
        previewImage.src = "";
      });
    }

    uploadContainer.addEventListener("dragover", function(e) {
      e.preventDefault();
      this.style.borderColor = getComputedStyle(this).getPropertyValue('--primary-color');
    });
    
    uploadContainer.addEventListener("drop", function(e) {
      e.preventDefault();
      this.style.borderColor = getComputedStyle(this).getPropertyValue('--border-color');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadInput.files = e.dataTransfer.files;
        showImagePreview(e.dataTransfer.files[0]);
      }
    });

    // Processar formulário
    form.addEventListener("submit", function(event) {
      event.preventDefault();

      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        github: document.getElementById("github").value.trim(),
        avatar: null
      };

      if (!formData.name || !formData.email || !formData.github) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      if (uploadInput.files.length > 0) {
        const file = uploadInput.files[0];
        if (file.size > 500 * 1024) {
          alert("A imagem deve ter no máximo 500KB");
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          formData.avatar = e.target.result;
          saveAndRedirect(formData);
        };
        reader.readAsDataURL(file);
      } else {
        saveAndRedirect(formData);
      }
    });

    function saveAndRedirect(data) {
      localStorage.setItem("ticketData", JSON.stringify(data));
      window.location.href = "ticket.html";
    }
  }

  if (window.location.pathname.includes("ticket.html")) {
    loadTicketData();
  }

  function loadTicketData() {
    const savedData = localStorage.getItem("ticketData");
    if (savedData) {
      const data = JSON.parse(savedData);

      document.querySelectorAll("#name").forEach(el => {
        el.textContent = data.name || "Visitante";
      });

      document.getElementById("ticket-name").textContent = data.name || "Visitante";
      
      document.getElementById("email").textContent = data.email || "email@exemplo.com";
      
      const githubUsername = data.github ? data.github.replace(/^@/, '') : "github_user";
      document.getElementById("github").textContent = `@${githubUsername}`;
      

      const avatarImg = document.getElementById("avatar-img");
      if (data.avatar) {
        avatarImg.src = data.avatar;
      } else {
        avatarImg.src = "../src/assets/images/image-avatar.svg";
      }
      
      const ticketId = generateTicketId();
      document.getElementById("ticket-id").textContent = `#${ticketId}`;
      } else {
      //
      window.location.href = "index.html";
      }
      }

      function generateTicketId() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
  }
});