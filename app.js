/**
 * ==============================================================================
 * ARCH × CODE ENGINE - IRVAN'S DUAL PERSPECTIVE PORTFOLIO
 * High-performance WebGL 3D, Parametric Geometry Generator, Terminal CLI,
 * Web Audio Synth, and Dynamic State Management
 * ==============================================================================
 */

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initPortfolio();
});

function initPortfolio() {
  initNavbarScroll();
  initPerspectiveSwitcher();
  initProjectFilters();
  initProjectModals();
  initHero3DViewport();
  initPlayground3D();
  initTerminalCLI();
  initFloatingHUD();
  initInquiryForm();
}

/* ==========================================================================
   WEB AUDIO API SYNTHESIZER (MICRO-FEEDBACK EFFECTS)
   ========================================================================== */
const AudioSynth = (() => {
  let ctx = null;
  let isMuted = false;

  function getContext() {
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        ctx = new AudioContext();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  return {
    toggleMute() {
      isMuted = !isMuted;
      return isMuted;
    },
    isMuted() {
      return isMuted;
    },
    playClick() {
      if (isMuted) return;
      try {
        const audio = getContext();
        if (!audio) return;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audio.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, audio.currentTime);
        gain.gain.linearRampToValueAtTime(0, audio.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start();
        osc.stop(audio.currentTime + 0.05);
      } catch (e) {}
    },
    playBeep(freq = 880) {
      if (isMuted) return;
      try {
        const audio = getContext();
        if (!audio) return;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audio.currentTime);
        gain.gain.setValueAtTime(0.05, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start();
        osc.stop(audio.currentTime + 0.12);
      } catch (e) {}
    },
    playChord() {
      if (isMuted) return;
      try {
        const audio = getContext();
        if (!audio) return;
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = audio.createOscillator();
          const gain = audio.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audio.currentTime + idx * 0.04);
          gain.gain.setValueAtTime(0.03, audio.currentTime + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.35 + idx * 0.04);
          osc.connect(gain);
          gain.connect(audio.destination);
          osc.start(audio.currentTime + idx * 0.04);
          osc.stop(audio.currentTime + 0.35 + idx * 0.04);
        });
      } catch (e) {}
    }
  };
})();

/* ==========================================================================
   NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Detection
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      AudioSynth.playClick();
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   PERSPECTIVE SWITCHER (HYBRID / ARCH / CODE MODES)
   ========================================================================== */
function initPerspectiveSwitcher() {
  const modeBtns = document.querySelectorAll('.mode-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSynth.playClick();
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      const root = document.documentElement;

      if (mode === 'arch') {
        document.body.setAttribute('data-theme', 'studio');
        filterProjects('arch');
        highlightFilterBtn('arch');
      } else if (mode === 'code') {
        document.body.setAttribute('data-theme', 'blueprint');
        filterProjects('software');
        highlightFilterBtn('software');
      } else {
        document.body.removeAttribute('data-theme');
        filterProjects('all');
        highlightFilterBtn('all');
      }
    });
  });

  function highlightFilterBtn(filterType) {
    filterBtns.forEach(btn => {
      if (btn.dataset.filter === filterType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   PROJECT FILTERING SYSTEM
   ========================================================================== */
function filterProjects(filterVal) {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const categories = card.dataset.category.split(' ');
    if (filterVal === 'all' || categories.includes(filterVal)) {
      card.style.display = 'flex';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSynth.playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });
}

/* ==========================================================================
   PROJECT CASE STUDY MODAL DATA & HANDLER
   ========================================================================== */
const projectDataStore = {
  1: {
    title: 'Paviliun Parametrik Nusantara',
    category: 'ARSITEKTUR & PARAMETRIK',
    meta: 'JAKARTA • 2025 • TERBANGUN',
    image: 'assets/images/arch_pavilion.jpg',
    scale: '450 m² Kanopi',
    efficiency: '-32% Penggunaan Kayu',
    tech: 'Rhino 3D + Kangaroo + CNC',
    challenge: 'Menciptakan ruang komunal semi-terbuka dengan bentang lengkung 28 meter tanpa tiang tengah, sekaligus tahan terhadap iklim tropis lembab dan guncangan seismik Indonesia.',
    solution: 'Menggunakan algoritma relaksasi fisika Kangaroo untuk menghasilkan geometri anticlastic yang secara alami mengalirkan beban tekan ke 4 fondasi utama. Bilah glulam jati diprogram melalui script Grasshopper ke file kode G-Code untuk fabrikasi CNC presisi 0.5mm.',
    tags: ['Rhino 3D', 'Grasshopper', 'Kangaroo Physics', 'Glulam Teak', 'Parametric BIM', 'Digital Fabrication']
  },
  2: {
    title: 'Skyline Nexus: Bioclimatic Smart Skyscraper',
    category: 'BIM & MENARA BERKELANJUTAN',
    meta: 'SCBD JAKARTA • 2024 • STUDY & DETAIL',
    image: 'assets/images/smart_tower.jpg',
    scale: '42 Lantai (85,000 m²)',
    efficiency: '-38% Beban Panas Surya (OTTV)',
    tech: 'Revit BIM + Ladybug Python',
    challenge: 'Gedung pencakar langit di iklim tropis Jakarta mengalami overheating fasad barat-timur yang menyebabkan lonjakan energi pendingin ruangan AC secara berlebih.',
    solution: 'Fasad Voronoi adaptif diprogram dengan algoritma Python Ladybug. Sudut kemiringan panel louver otomatis menyesuaikan kalkulasi azimuth matahari tahunan, membiaskan silau namun tetap memaksimalkan pencahayaan alami (daylighting).',
    tags: ['Autodesk Revit BIM', 'Ladybug Tools', 'Python Scripting', 'Voronoi Cellular', 'BEM EnergyPlus']
  },
  3: {
    title: 'ArcGene: Generative CAD Web Studio',
    category: 'SOFTWARE & WEBGL 3D',
    meta: 'SAAS PLATFORM • 2025 • LIVE TOOL',
    image: 'assets/images/generative_cad_ui.jpg',
    scale: 'Cloud SaaS Application',
    efficiency: '10x Kecepatan Massa Desain',
    tech: 'TypeScript + Three.js + WASM',
    challenge: 'Software arsitektur konvensional (Rhino, Revit) berat, mahal, dan membutuhkan PC spesifikasi tinggi sehingga menyulitkan kolaborasi cepat dengan klien.',
    solution: 'Membangun aplikasi WebGL 2.0 ringan di browser yang dapat memprogram dan merender massa arsitektur parametrik secara real-time. Dilengkapi kalkulator instan Gross Floor Area (GFA), rasio luas lantai, dan ekspor instan ke format glTF serta IFC OpenBIM.',
    tags: ['TypeScript', 'Three.js', 'React.js', 'WebAssembly', 'glTF 2.0', 'OpenBIM IFC']
  },
  4: {
    title: 'Villa Kinanti: Tropical Brutalism',
    category: 'RESIDENTIAL ARSITEKTUR & IOT',
    meta: 'ULUWATU BALI • 2024 • TERBANGUN',
    image: 'assets/images/tropical_villa.jpg',
    scale: 'Luas Lahan 850 m² / Bangunan 680 m²',
    efficiency: 'Passive Cooling 100% Siang Hari',
    tech: 'Exposed Concrete + ESP32 IoT',
    challenge: 'Topografi lereng tebing kapur yang curam dengan paparan angin laut bergaram tinggi dan matahari tropis yang intens.',
    solution: 'Desain kantilever beton ekspos masif yang memayungi bukaan kaca besar. Dilengkapi sirap kayu jati tahan garam serta sistem kontrol mikrokontroler mandiri ESP32 untuk monitoring kelembapan dan buka-tutup ventilasi otomatis.',
    tags: ['Architectural Concrete', 'Cantilever Engineering', 'Bioclimatic Villa', 'Microclimate IoT', 'Home Assistant']
  },
  5: {
    title: 'SpatialTwin: Smart Building IoT Dashboard',
    category: 'DIGITAL TWIN & ENTERPRISE WEB',
    meta: 'ENTERPRISE PLATFORM • 2025',
    image: 'assets/images/smart_tower.jpg',
    scale: '500+ Sensor Node Gedung',
    efficiency: '-24% Konsumsi Energi Listrik',
    tech: 'Three.js + Node.js + InfluxDB',
    challenge: 'Manajer fasilitas gedung kesulitan mengidentifikasi kebocoran energi dan titik panas (hotspots) hanya dari tabel spreadsheet data statis.',
    solution: 'Platform Digital Twin 3D real-time yang memetakan data sensor IoT (suhu, kelembapan, konsumsi kWh, okupansi orang) langsung ke mesh 3D model gedung per lantai dengan visualisasi color heatmap interaktif via WebSockets.',
    tags: ['Three.js', 'WebSockets', 'InfluxDB', 'Time-series Heatmap', 'IoT Telemetry', 'IFC.js']
  },
  6: {
    title: 'RhinoToWeb: High-Performance glTF Pipeline',
    category: 'OPEN SOURCE & CLI DEVELOPER TOOL',
    meta: 'DEVELOPER TOOL • 2024 • OPEN SOURCE',
    image: 'assets/images/generative_cad_ui.jpg',
    scale: 'Global GitHub Tool',
    efficiency: '-78% Kompresi Ukuran File',
    tech: 'Rust + Rhino3dm + Draco',
    challenge: 'Model 3D arsitektural dari Rhino/Grasshopper memiliki jumlah poligon jutaan dan ukuran file ratusan megabyte sehingga gagal dibuka di browser web biasa.',
    solution: 'Pipeline CLI berbasis bahasa Rust yang mengonversi geometri NURBS/Brep kompleks menjadi jaring poligon terkompresi Draco glTF 2.0 dengan hierarki metadata layer arsitektur yang tetap utuh.',
    tags: ['Rust Lang', 'Rhino3dm API', 'glTF 2.0', 'Google Draco', 'Web Performance']
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCloseSec = document.getElementById('modal-close-secondary');
  const viewBtns = document.querySelectorAll('.view-project-btn');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      AudioSynth.playClick();
      const id = btn.dataset.projectId;
      const data = projectDataStore[id];
      if (data) {
        document.getElementById('modal-img').src = data.image;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-badge').textContent = data.category;
        document.getElementById('modal-meta').textContent = data.meta;
        document.getElementById('stat-scale').textContent = data.scale;
        document.getElementById('stat-efficiency').textContent = data.efficiency;
        document.getElementById('stat-tech').textContent = data.tech;
        document.getElementById('modal-challenge').textContent = data.challenge;
        document.getElementById('modal-solution').textContent = data.solution;

        // Tags
        const tagsBox = document.getElementById('modal-tags');
        tagsBox.innerHTML = '';
        data.tags.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = t;
          tagsBox.appendChild(span);
        });

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    AudioSynth.playClick();
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCloseSec) modalCloseSec.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/* ==========================================================================
   HERO SECTION: 3D PARAMETRIC PAVILION (THREE.JS)
   ========================================================================== */
function initHero3DViewport() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || !window.THREE) return;

  const container = canvas.parentElement;
  let width = container.clientWidth || 480;
  let height = container.clientHeight || 440;

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0d14, 0.035);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(6, 5, 8);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Controls
  let controls;
  if (window.THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Stay above ground
    controls.minDistance = 4;
    controls.maxDistance = 16;
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
  dirLight1.position.set(8, 12, 6);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.0);
  dirLight2.position.set(-8, 6, -6);
  scene.add(dirLight2);

  // Create Parametric Architectural Pavilion Group
  const pavilionGroup = new THREE.Group();
  scene.add(pavilionGroup);

  // Construct Parametric Curved Ribs
  const numRibs = 28;
  const ribCurvePts = 30;
  const ribMaterialCyan = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
  const ribMaterialAmber = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });

  for (let i = 0; i < numRibs; i++) {
    const t = (i / numRibs) * Math.PI * 2;
    const radius = 2.8 + 0.6 * Math.sin(t * 3);
    const points = [];

    for (let j = 0; j <= ribCurvePts; j++) {
      const u = (j / ribCurvePts) * Math.PI;
      const x = radius * Math.cos(t) * Math.sin(u);
      const y = 3.2 * Math.sin(u) * (1.0 + 0.3 * Math.cos(t * 2));
      const z = radius * Math.sin(t) * Math.sin(u);
      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, i % 2 === 0 ? ribMaterialCyan : ribMaterialAmber);
    pavilionGroup.add(line);
  }

  // Add Dynamic Structural Ring Nodes
  const nodeCount = 50;
  const nodeGeo = new THREE.BufferGeometry();
  const nodePositions = [];
  for (let k = 0; k < nodeCount; k++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.5 + Math.random() * 2.2;
    const h = Math.random() * 2.5;
    nodePositions.push(r * Math.cos(theta), h, r * Math.sin(theta));
  }
  nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
  const nodeMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.12, transparent: true, opacity: 0.8 });
  const particleNodes = new THREE.Points(nodeGeo, nodeMat);
  pavilionGroup.add(particleNodes);

  // Reflective Floor Grid
  const gridHelper = new THREE.GridHelper(14, 28, 0x00f0ff, 0x1e293b);
  gridHelper.position.y = -0.05;
  scene.add(gridHelper);

  // Resize Handler
  function onResize() {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  // Animation Loop
  let frameCount = 0;
  let lastTime = performance.now();
  const fpsEl = document.getElementById('hud-fps');
  const twistEl = document.getElementById('hud-twist');

  function animate() {
    requestAnimationFrame(animate);

    pavilionGroup.rotation.y += 0.004;

    if (controls) controls.update();
    renderer.render(scene, camera);

    // FPS calculation
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = `${frameCount}`;
      frameCount = 0;
      lastTime = now;
      if (twistEl) {
        const deg = Math.floor((pavilionGroup.rotation.y * 180 / Math.PI) % 360);
        twistEl.textContent = `${deg}°`;
      }
    }
  }

  animate();
}

/* ==========================================================================
   INTERACTIVE PARAMETRIC PLAYGROUND / LAB (THE ARCH-CODE GENERATOR)
   ========================================================================== */
function initPlayground3D() {
  const canvas = document.getElementById('playground-canvas');
  if (!canvas || !window.THREE) return;

  const container = canvas.parentElement;
  let width = container.clientWidth || 600;
  let height = container.clientHeight || 500;

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06090e, 0.03);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(8, 7, 10);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  let controls;
  if (window.THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3;
    controls.maxDistance = 25;
  }

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const light1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
  light1.position.set(10, 15, 10);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xf59e0b, 0.8);
  light2.position.set(-10, 8, -10);
  scene.add(light2);

  // Ground Grid
  const grid = new THREE.GridHelper(16, 32, 0x00f0ff, 0x1e293b);
  grid.position.y = 0;
  scene.add(grid);

  // Tower Object Container
  const towerGroup = new THREE.Group();
  scene.add(towerGroup);

  // State Variables
  let twistAngle = 90; // degrees
  let floorCount = 24;
  let taperRatio = 0.65;
  let ribDensity = 16;
  let isWireframe = true;
  let autoRotate = true;
  let activeMat = 'cyan';

  const materialPalettes = {
    cyan: { line: 0x00f0ff, solid: 0x0284c7 },
    amber: { line: 0xf59e0b, solid: 0xd97706 },
    emerald: { line: 0x10b981, solid: 0x059669 },
    white: { line: 0xffffff, solid: 0x64748b }
  };

  // Build Procedural Tower Mesh
  function rebuildTower() {
    // Clear old geometry
    while (towerGroup.children.length > 0) {
      const child = towerGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      towerGroup.remove(child);
    }

    const colConfig = materialPalettes[activeMat] || materialPalettes.cyan;
    const totalHeight = 6.0;
    const baseRadius = 2.2;
    const floorHeight = totalHeight / floorCount;

    // Build Floor Slabs & Louvers
    for (let f = 0; f < floorCount; f++) {
      const prog = f / floorCount;
      const y = f * floorHeight;
      const curTwist = ((twistAngle * Math.PI) / 180) * prog;
      const curScale = (1.0 - (1.0 - taperRatio) * prog) * baseRadius;

      // Outer Louver Points
      const pts = [];
      for (let r = 0; r <= ribDensity; r++) {
        const theta = (r / ribDensity) * Math.PI * 2 + curTwist;
        const px = curScale * Math.cos(theta);
        const pz = curScale * Math.sin(theta);
        pts.push(new THREE.Vector3(px, y, pz));
      }

      const slabGeo = new THREE.BufferGeometry().setFromPoints(pts);

      if (isWireframe) {
        const slabLineMat = new THREE.LineBasicMaterial({
          color: colConfig.line,
          transparent: true,
          opacity: 0.8
        });
        const slabLine = new THREE.Line(slabGeo, slabLineMat);
        towerGroup.add(slabLine);
      } else {
        // Solid Plate approximation
        const shape = new THREE.Shape();
        pts.forEach((p, idx) => {
          if (idx === 0) shape.moveTo(p.x, p.z);
          else shape.lineTo(p.x, p.z);
        });
        const extrudeSettings = { depth: 0.04, bevelEnabled: false };
        const solidGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        solidGeo.rotateX(Math.PI / 2);
        solidGeo.translate(0, y, 0);

        const solidMat = new THREE.MeshStandardMaterial({
          color: colConfig.solid,
          metalness: 0.3,
          roughness: 0.4,
          wireframe: false
        });
        const solidMesh = new THREE.Mesh(solidGeo, solidMat);
        towerGroup.add(solidMesh);
      }
    }

    // Vertical Structural Spine Columns (4 corners or columns)
    const spineColumns = 4;
    for (let c = 0; c < spineColumns; c++) {
      const spinePts = [];
      const colBaseAngle = (c / spineColumns) * Math.PI * 2;
      for (let f = 0; f <= floorCount; f++) {
        const prog = f / floorCount;
        const y = f * floorHeight;
        const curTwist = ((twistAngle * Math.PI) / 180) * prog;
        const curScale = (1.0 - (1.0 - taperRatio) * prog) * baseRadius;
        const theta = colBaseAngle + curTwist;
        spinePts.push(new THREE.Vector3(curScale * Math.cos(theta), y, curScale * Math.sin(theta)));
      }
      const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePts);
      const spineMat = new THREE.LineBasicMaterial({
        color: colConfig.line,
        linewidth: 2,
        transparent: true,
        opacity: 0.95
      });
      const spineLine = new THREE.Line(spineGeo, spineMat);
      towerGroup.add(spineLine);
    }

    // Synchronize Code Generator Display
    updateLiveCodeSnippet();
  }

  function updateLiveCodeSnippet() {
    const codeEl = document.getElementById('live-code-snippet');
    if (!codeEl) return;

    codeEl.innerHTML = `<code># Parametric Tower Generator (Python / Grasshopper)
import math

floors = ${floorCount}
twist_angle_deg = ${twistAngle}.0
taper_ratio = ${taperRatio.toFixed(2)}
rib_count = ${ribDensity}

def build_facade_levels():
    geometries = []
    for level in range(floors):
        progress = level / float(floors)
        angle = math.radians((twist_angle_deg / floors) * level)
        radius = 2.2 * (1.0 - (1.0 - taper_ratio) * progress)
        
        # Calculate parametric ribs
        ribs = [
            (radius * math.cos(i * 2 * math.pi / rib_count + angle),
             level * 0.25,
             radius * math.sin(i * 2 * math.pi / rib_count + angle))
            for i in range(rib_count)
        ]
        geometries.append(ribs)
    return geometries</code>`;
  }

  // Initial Build
  rebuildTower();

  // Control Listeners
  const sliderTwist = document.getElementById('slider-twist');
  const sliderFloors = document.getElementById('slider-floors');
  const sliderTaper = document.getElementById('slider-taper');
  const sliderRibs = document.getElementById('slider-ribs');

  const valTwist = document.getElementById('val-twist');
  const valFloors = document.getElementById('val-floors');
  const valTaper = document.getElementById('val-taper');
  const valRibs = document.getElementById('val-ribs');

  if (sliderTwist) {
    sliderTwist.addEventListener('input', (e) => {
      twistAngle = parseInt(e.target.value, 10);
      valTwist.textContent = `${twistAngle}°`;
      rebuildTower();
    });
  }

  if (sliderFloors) {
    sliderFloors.addEventListener('input', (e) => {
      floorCount = parseInt(e.target.value, 10);
      valFloors.textContent = `${floorCount} Fl`;
      rebuildTower();
    });
  }

  if (sliderTaper) {
    sliderTaper.addEventListener('input', (e) => {
      taperRatio = parseInt(e.target.value, 10) / 100;
      valTaper.textContent = taperRatio.toFixed(2);
      rebuildTower();
    });
  }

  if (sliderRibs) {
    sliderRibs.addEventListener('input', (e) => {
      ribDensity = parseInt(e.target.value, 10);
      valRibs.textContent = `${ribDensity} Ribs`;
      rebuildTower();
    });
  }

  // Material Chips
  const styleChips = document.querySelectorAll('.style-chip');
  styleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      AudioSynth.playClick();
      styleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeMat = chip.dataset.mat;
      rebuildTower();
    });
  });

  // Wire vs Solid Buttons
  const btnWire = document.getElementById('btn-view-wire');
  const btnSolid = document.getElementById('btn-view-solid');

  if (btnWire && btnSolid) {
    btnWire.addEventListener('click', () => {
      AudioSynth.playClick();
      btnWire.classList.add('active');
      btnSolid.classList.remove('active');
      isWireframe = true;
      rebuildTower();
    });

    btnSolid.addEventListener('click', () => {
      AudioSynth.playClick();
      btnSolid.classList.add('active');
      btnWire.classList.remove('active');
      isWireframe = false;
      rebuildTower();
    });
  }

  // Auto Rotate & Reset Cam
  const btnAutoRotate = document.getElementById('btn-auto-rotate');
  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      AudioSynth.playClick();
      autoRotate = !autoRotate;
      btnAutoRotate.classList.toggle('active', autoRotate);
    });
  }

  const btnResetCam = document.getElementById('btn-reset-cam');
  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      AudioSynth.playClick();
      camera.position.set(8, 7, 10);
      camera.lookAt(0, 3, 0);
      if (controls) controls.target.set(0, 3, 0);
    });
  }

  // Copy Code Button
  const btnCopyCode = document.getElementById('btn-copy-code');
  if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
      AudioSynth.playBeep(1200);
      const snippet = document.getElementById('live-code-snippet').textContent;
      navigator.clipboard.writeText(snippet).then(() => {
        const textSpan = document.getElementById('copy-btn-text');
        textSpan.textContent = '✓ Tersalin!';
        setTimeout(() => {
          textSpan.textContent = 'Salin Kode';
        }, 2000);
      });
    });
  }

  // Resize Handler
  function onResizePlayground() {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResizePlayground);

  // Animation Loop
  function animatePlayground() {
    requestAnimationFrame(animatePlayground);

    if (autoRotate) {
      towerGroup.rotation.y += 0.005;
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  animatePlayground();
}

/* ==========================================================================
   INTERACTIVE TERMINAL HUD (CLI SYSTEM)
   ========================================================================== */
function initTerminalCLI() {
  const modal = document.getElementById('terminal-modal');
  const openBtn = document.getElementById('open-terminal-btn');
  const fabBtn = document.getElementById('fab-terminal');
  const closeBtn = document.getElementById('close-terminal-btn');
  const closeDot = document.getElementById('term-close-dot');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  function openTerminal() {
    AudioSynth.playBeep(880);
    modal.classList.add('open');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }

  function closeTerminal() {
    AudioSynth.playClick();
    modal.classList.remove('open');
  }

  if (openBtn) openBtn.addEventListener('click', openTerminal);
  if (fabBtn) fabBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (closeDot) closeDot.addEventListener('click', closeTerminal);

  // Keyboard Shortcut: `~` or `Escape`
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      if (modal.classList.contains('open')) closeTerminal();
      else openTerminal();
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeTerminal();
    }
  });

  // Command Execution
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        input.value = '';
        if (cmd) {
          executeCommand(cmd);
        }
      }
    });
  }

  function printLine(text, color = 'var(--text-code)') {
    const div = document.createElement('div');
    div.style.color = color;
    div.innerHTML = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function executeCommand(cmd) {
    printLine(`irvan@system:~$ ${cmd}`, 'var(--accent-amber)');
    AudioSynth.playBeep(640);

    const parts = cmd.split(' ');
    const root = parts[0];

    switch (root) {
      case 'help':
        printLine('Tersedia perintah berikut:');
        printLine('  <strong>about</strong>     - Menampilkan profil &amp; kredensial');
        printLine('  <strong>projects</strong>  - Daftar proyek arsitektur &amp; software');
        printLine('  <strong>skills</strong>    - Daftar alat, bahasa pemrograman &amp; BIM');
        printLine('  <strong>blueprint</strong> - Toggle overlay grid drafting millimeter');
        printLine('  <strong>theme</strong>     - Ganti tema [default | blueprint | studio]');
        printLine('  <strong>calc [m²]</strong>  - Kalkulasi estimasi durasi &amp; geometri BIM');
        printLine('  <strong>contact</strong>   - Kontak WhatsApp, email, dan LinkedIn');
        printLine('  <strong>clear</strong>     - Bersihkan layar terminal');
        printLine('  <strong>sudo hire</strong>  - Peluang kolaborasi eksklusif');
        break;

      case 'about':
        printLine('<strong>IRVAN // ARCHITECTURAL DESIGNER &amp; SOFTWARE ENGINEER</strong>', 'var(--accent-cyan)');
        printLine('Spesialisasi: Computational Design, Parametric Architecture, WebGL &amp; Modern Web Tech.');
        printLine('Visi: Menjembatani dunia fisik dengan efisiensi algoritma komputasi.');
        break;

      case 'projects':
        printLine('<strong>Daftar Proyek Unggulan:</strong>');
        printLine('  1. Paviliun Parametrik Nusantara (Timber Glulam, Grasshopper)');
        printLine('  2. Skyline Nexus (42-Floor Bioclimatic BIM Skyscraper)');
        printLine('  3. ArcGene (Generative CAD 3D Web Studio)');
        printLine('  4. Villa Kinanti (Tropical Brutalism &amp; Smart IoT)');
        printLine('  5. SpatialTwin (Smart Building Digital Twin Dashboard)');
        printLine('  6. RhinoToWeb (High-performance glTF Pipeline CLI)');
        break;

      case 'skills':
        printLine('<strong>Architectural Stack:</strong> Rhino 3D, Grasshopper, Autodesk Revit (BIM), Ladybug, V-Ray, AutoCAD');
        printLine('<strong>Software Stack:</strong> TypeScript, Three.js, Python, React, Next.js, Node.js, Rust/WASM, WebSockets');
        break;

      case 'blueprint':
        document.body.classList.toggle('blueprint-mode-active');
        const active = document.body.classList.contains('blueprint-mode-active');
        printLine(`Blueprint Drafting Grid: ${active ? 'AKTIF (ON)' : 'NON-AKTIF (OFF)'}`, active ? 'var(--accent-cyan)' : 'var(--text-dim)');
        break;

      case 'theme':
        const theme = parts[1];
        if (theme === 'blueprint' || theme === 'studio' || theme === 'default') {
          if (theme === 'default') document.body.removeAttribute('data-theme');
          else document.body.setAttribute('data-theme', theme);
          printLine(`Tema berhasil diubah ke: ${theme}`, 'var(--accent-emerald)');
        } else {
          printLine('Penggunaan: theme [default | blueprint | studio]', '#ef4444');
        }
        break;

      case 'calc':
        const sqm = parseFloat(parts[1]) || 500;
        const estWeeks = Math.ceil(Math.sqrt(sqm) * 0.45);
        const polyEst = Math.floor(sqm * 42);
        printLine(`<strong>Kalkulasi Estimasi Model Spasial (${sqm} m²):</strong>`);
        printLine(`  - Estimasi Durasi Perancangan BIM: ~${estWeeks} Minggu`);
        printLine(`  - Estimasi Kompleksitas Poligon 3D: ~${polyEst.toLocaleString()} Triangles`);
        printLine(`  - Rekomendasi Alur: Form-Finding Parametrik -> Uji Termal Ladybug -> Fabrikasi`);
        break;

      case 'contact':
        printLine('WhatsApp: +62 812-3456-7890');
        printLine('Email: irvan.archtech@gmail.com');
        printLine('LinkedIn: linkedin.com/in/irvan-computational');
        printLine('GitHub: github.com/irvan-archtech');
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      case 'sudo':
        if (parts[1] === 'hire' || parts[1] === 'hire-irvan') {
          printLine('Akses Superuser Diterima: Membuka saluran prioritas WhatsApp...', 'var(--accent-emerald)');
          AudioSynth.playChord();
          setTimeout(() => {
            window.open('https://wa.me/6281234567890?text=Halo%20Irvan,%20saya%20tertarik%20bekerjasama%20secara%20langsung.', '_blank');
          }, 800);
        } else {
          printLine('Perintah tidak dikenali. Coba: sudo hire', '#ef4444');
        }
        break;

      default:
        printLine(`Perintah '${cmd}' tidak dikenali. Ketik 'help' untuk panduan.`, '#ef4444');
        break;
    }
  }
}

/* ==========================================================================
   FLOATING HUD TOOLS (AUDIO SYNTH & BLUEPRINT RULER TOGGLE)
   ========================================================================== */
function initFloatingHUD() {
  const fabBlueprint = document.getElementById('fab-blueprint');
  const fabAudio = document.getElementById('fab-audio');
  const audioIcon = document.getElementById('audio-icon');

  if (fabBlueprint) {
    fabBlueprint.addEventListener('click', () => {
      AudioSynth.playClick();
      document.body.classList.toggle('blueprint-mode-active');
      fabBlueprint.classList.toggle('active', document.body.classList.contains('blueprint-mode-active'));
    });
  }

  if (fabAudio) {
    fabAudio.addEventListener('click', () => {
      const isMuted = AudioSynth.toggleMute();
      fabAudio.classList.toggle('active', !isMuted);
      if (audioIcon) {
        audioIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
        if (window.lucide) window.lucide.createIcons();
      }
      if (!isMuted) {
        AudioSynth.playBeep(980);
      }
    });
  }
}

/* ==========================================================================
   INQUIRY & COLLABORATION FORM HANDLER
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('collaboration-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    AudioSynth.playChord();

    const projectType = form.querySelector('input[name="projectType"]:checked')?.value || 'Desain Arsitektur';
    const name = document.getElementById('contact-name').value.trim();
    const contact = document.getElementById('contact-input-email').value.trim();
    const msg = document.getElementById('contact-message').value.trim();

    // Prepare WhatsApp URL
    const waText = `Halo Irvan, saya ${name} (${contact}).%0A%0ATipe Proyek: ${encodeURIComponent(projectType)}%0A%0ACatatan: ${encodeURIComponent(msg)}`;
    const waUrl = `https://wa.me/6281234567890?text=${waText}`;

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.color = 'var(--accent-emerald)';
      feedback.innerHTML = `✓ Terima kasih <strong>${name}</strong>! Menghubungkan Anda ke WhatsApp resmi untuk respon instan...`;
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
    }, 1000);
  });
}
