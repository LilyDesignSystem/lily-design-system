// The page script of file-upload-form.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    var files = [];
    var fileInput = document.getElementById("file-input");
    var fileList = document.getElementById("file-list");
    var fileListSection = document.getElementById("file-list-section");
    var uploadBtn = document.getElementById("upload-btn");
    var progressBar = document.getElementById("upload-progress");
    var uploadAlert = document.getElementById("upload-alert");
    var uploading = false;
    var done = false;

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function renderFiles() {
        fileList.innerHTML = "";
        files.forEach(function (file, index) {
            var li = document.createElement("li");
            li.textContent = file.name + " ";
            var badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = formatSize(file.size);
            li.appendChild(badge);
            if (!uploading && !done) {
                var removeBtn = document.createElement("button");
                removeBtn.className = "button";
                removeBtn.textContent = "Remove";
                removeBtn.setAttribute("aria-label", "Remove " + file.name);
                removeBtn.addEventListener("click", function () {
                    files.splice(index, 1);
                    renderFiles();
                });
                li.appendChild(document.createTextNode(" "));
                li.appendChild(removeBtn);
            }
            fileList.appendChild(li);
        });
        fileListSection.hidden = files.length === 0;
        uploadBtn.disabled = files.length === 0 || uploading || done;
    }

    fileInput.addEventListener("change", function () {
        var newFiles = Array.from(fileInput.files).map(function (f) {
            return { name: f.name, size: f.size };
        });
        files = files.concat(newFiles);
        renderFiles();
        fileInput.value = "";
    });

    document.getElementById("upload-form").addEventListener("submit", function (e) {
        e.preventDefault();
        if (files.length === 0 || uploading || done) return;

        uploading = true;
        uploadBtn.disabled = true;
        uploadBtn.textContent = "Uploading...";
        progressBar.hidden = false;
        progressBar.value = 0;
        renderFiles();

        var progress = 0;
        var interval = setInterval(function () {
            progress += 10;
            progressBar.value = progress;
            if (progress >= 100) {
                clearInterval(interval);
                uploading = false;
                done = true;
                document.getElementById("upload-file-count").textContent = files.length;
                uploadAlert.hidden = false;
                uploadBtn.textContent = "Upload Files";
                renderFiles();
            }
        }, 300);
    });
})();
