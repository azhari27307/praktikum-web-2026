
const projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

function updateStats(dataList) {
    const totalProyek = dataList.length;
    const totalAnggaran = dataList.reduce(
        (total, project) => total + project.budget,
        0
    );
    const proyekSelesai = dataList.filter(
        project => project.completed
    ).length;

    document.getElementById("total-proyek").textContent = totalProyek;
    document.getElementById("total-anggaran").textContent =
        formatRupiah(totalAnggaran);
    document.getElementById("proyek-selesai").textContent = proyekSelesai;
}

function renderProjects(dataList) {
    const daftarProyek = document.getElementById("daftar-proyek");

    if (dataList.length === 0) {
        daftarProyek.innerHTML = "<p>Proyek tidak ditemukan.</p>";
        return;
    }

    daftarProyek.innerHTML = dataList.map(project => `
        <article>
            <h3>${project.title}</h3>
            <p>Kategori: ${project.category}</p>
            <p>Anggaran: ${formatRupiah(project.budget)}</p>
            <p>Status: ${project.completed
                ? "Selesai"
                : "Dalam Pengerjaan"}</p>
            <button type="button" onclick="toggleStatus(${project.id})">
                ${project.completed
                    ? "Ubah ke Dalam Pengerjaan"
                    : "Tandai Selesai"}
            </button>
            <button type="button" onclick="deleteProject(${project.id})">
                Hapus
            </button>
        </article>
    `).join("");
}

function refreshProjects() {
    updateStats(projects);
    renderProjects(getFilteredProjects());
}

function getFilteredProjects() {
    const kataKunci = document.getElementById("pencarian-proyek")
        .value.toLowerCase();

    const kategori = document.getElementById("filter-kategori").value;

    return projects.filter(project => {
        const cocokNama = project.title.toLowerCase().includes(kataKunci);
        const cocokKategori =
            kategori === "Semua" || project.category === kategori;

        return cocokNama && cocokKategori;
    });
}

function toggleStatus(id) {
    const project = projects.find(project => project.id === id);

    if (project) {
        project.completed = !project.completed;
        refreshProjects();
    }
}

function deleteProject(id) {
    const index = projects.findIndex(project => project.id === id);

    if (index !== -1) {
        projects.splice(index, 1);
        refreshProjects();
    }
}

document.getElementById("form-proyek").addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("judul-proyek").value.trim();
    const category = document.getElementById("kategori-proyek").value;
    const budget = Number(document.getElementById("anggaran-proyek").value);
    const completed = document.getElementById("status-proyek").checked;

    if (title === "") {
        alert("Nama proyek wajib diisi.");
        return;
    }

    if (budget <= 0 || !Number.isFinite(budget)) {
        alert("Anggaran harus lebih besar dari 0.");
        return;
    }

    projects.push({
        id: Date.now(),
        title,
        category,
        budget,
        completed
    });

    this.reset();
    refreshProjects();
});

document.getElementById("pencarian-proyek").addEventListener(
    "input",
    refreshProjects
);

document.getElementById("filter-kategori").addEventListener(
    "change",
    refreshProjects
);

refreshProjects();
