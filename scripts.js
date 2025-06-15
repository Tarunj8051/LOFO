document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reportForm");
    const imageInput = document.getElementById("imageInput");
    const preview = document.getElementById("preview");
  
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (!file || !file.type.startsWith("image/")) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        document.getElementById("imageBase64").value = e.target.result.split(",")[1];
      };
      reader.readAsDataURL(file);
    });
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusDiv = document.getElementById("status");
      statusDiv.innerHTML = "Submitting...";
  
      const payload = {
        usn: form.usn.value,
        branch: form.branch.value,
        item: form.item.value,
        location: form.location.value,
        date: form.date.value,
        contact: form.contact.value,
        imageBase64: document.getElementById("imageBase64").value,
        imageType: imageInput.files[0]?.type || "image/png"
      };
  
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwNjNnyFrbuE5H1SlwGwP77j8ebzKbUGIHjf-YI0csPBxNNh6H0JNUB7hHEaCWM4ccN/exec", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        const result = await response.json();
        if (result.success) {
          statusDiv.innerHTML = "✅ Successfully submitted!";
          form.reset();
          preview.src = "";
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (err) {
        console.error(err);
        statusDiv.innerHTML = "❌ Submission failed: " + err.message;
      }
    });
  });
  