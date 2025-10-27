// ===== Seed & Utilities =====
const LS_KEYS = {
  CART: "carrito",
  PRODUCTS: "productosData",
  USERS: "usuariosData",
  SESSION: "sessionUser"
};

// Formato de moneda CLP
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

function seedData(){
  if(!localStorage.getItem(LS_KEYS.PRODUCTS)){
    const seedProducts = [
      { id: 1,  codigo:"JM001", nombre: "Catan", descripcion:"Juego de estrategia y comercio", precio: 29990,  stock: 12, stockCritico: 3, categoria:"Juegos de Mesa", img: "img/catan.jpg" },
      { id: 2,  codigo:"JM002", nombre: "Carcassonne", descripcion:"Colocación de losetas medieval", precio: 24990,  stock: 10, stockCritico: 2, categoria:"Juegos de Mesa", img: "img/carcassonne.jpg" },
      { id: 3,  codigo:"AC001", nombre: "Controlador Inalámbrico Xbox Series X", descripcion:"Ergonómico, compatible Xbox y PC", precio: 59990,  stock: 20, stockCritico: 4, categoria:"Accesorios", img: "img/xbox-controller.jpg" },
      { id: 4,  codigo:"AC002", nombre: "Auriculares Gamer HyperX Cloud II", descripcion:"Sonido envolvente 7.1, mic desmontable", precio: 74990,  stock: 15, stockCritico: 3, categoria:"Accesorios", img: "img/hyperx-cloud2.jpg" },
      { id: 5,  codigo:"CO001", nombre: "PlayStation 5", descripcion:"Consola next-gen", precio: 549990, stock: 5,  stockCritico: 1, categoria:"Consolas", img: "img/ps5.jpg" },
      { id: 6,  codigo:"PC001", nombre: "PC Gamer ASUS ROG Strix", descripcion:"Alto rendimiento para gaming", precio: 1399990, stock: 4, stockCritico: 1, categoria:"PC Gamer", img: "img/asus-rog-strix.jpg" },
      { id: 7,  codigo:"SG001", nombre: "Silla Gamer Secretlab Titan", descripcion:"Ergonómica gamer", precio: 349990, stock: 3,  stockCritico: 1, categoria:"Sillas Gamers", img: "img/silla.jpg" },
      { id: 8,  codigo:"AC003", nombre: "Mouse Gamer Logitech G502 HERO", descripcion:"Sensor HERO, botones programables", precio: 49990,  stock: 25, stockCritico: 5, categoria:"Accesorios", img: "img/logitech-g502-hero.jpg" },
      { id: 9,  codigo:"AC004", nombre: "Mousepad Razer Goliathus Extended Chroma", descripcion:"RGB, superficie amplia y uniforme", precio: 39990,  stock: 18, stockCritico: 4, categoria:"Accesorios", img: "img/razer-goliathus.jpg" },
      { id: 10, codigo:"RG001", nombre: "Polera Gamer Personalizada 'Level-Up'", descripcion:"Personalizable con gamer tag", precio: 15990,  stock: 30, stockCritico: 8, categoria:"Ropa Gamer", img: "img/polera-levelup.jpg" }
    ];
    localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(seedProducts));
  }
  if(!localStorage.getItem(LS_KEYS.USERS)){
    const seedUsers = [
      { id:1, run:"19011022K", nombre:"Admin",    apellidos:"Demo", correo:"admin@gmail.com",    pass:"1234", tipo:"Administrador", direccion:"Base 123" },
      { id:2, run:"141234560", nombre:"Vendedor", apellidos:"Demo", correo:"vendedor@gmail.com", pass:"1234", tipo:"Vendedor",     direccion:"Local 321" },
      { id:3, run:"130000009", nombre:"Cliente",  apellidos:"Demo", correo:"cliente@gmail.com",  pass:"1234", tipo:"Cliente",      direccion:"Casa 456" }
    ];
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(seedUsers));
  }
  if(!localStorage.getItem(LS_KEYS.CART)){
    localStorage.setItem(LS_KEYS.CART, JSON.stringify([]));
  }
}
seedData();

function getProducts(){ return JSON.parse(localStorage.getItem(LS_KEYS.PRODUCTS)) || []; }
function saveProducts(arr){ localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(arr)); }
function getUsers(){ return JSON.parse(localStorage.getItem(LS_KEYS.USERS)) || []; }
function saveUsers(arr){ localStorage.setItem(LS_KEYS.USERS, JSON.stringify(arr)); }
function getCart(){ return JSON.parse(localStorage.getItem(LS_KEYS.CART)) || []; }
function saveCart(arr){ localStorage.setItem(LS_KEYS.CART, JSON.stringify(arr)); }

function updateCartBadge(){
  const badge = document.getElementById("cartCount");
  if(badge){ badge.innerText = getCart().length; }
}
updateCartBadge();

// ===== RUT/RUN Validation (sin puntos/guion) =====
function validarRUN(run){
  const clean = (run || "").toUpperCase().replace(/[^0-9K]/g,"");
  if(clean.length < 7 || clean.length > 9) return false;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let suma = 0, mult = 2;
  for(let i=cuerpo.length-1; i>=0; i--){
    suma += parseInt(cuerpo[i],10)*mult;
    mult = mult === 7 ? 2 : mult+1;
  }
  const res = 11 - (suma % 11);
  const dig = (res === 11) ? "0" : (res === 10) ? "K" : String(res);
  return dig === dv;
}

// ===== Regions & Comunas (simple demo) =====
const REGIONES = {
  "Biobío": ["Concepción","Coronel","Talcahuano","Hualpén"],
  "Ñuble": ["Chillán","San Carlos"],
  "RM": ["Santiago","Maipú","Puente Alto"]
};

function cargarRegiones(regionSelId, comunaSelId){
  const r = document.getElementById(regionSelId);
  const c = document.getElementById(comunaSelId);
  if(!r || !c) return;
  r.innerHTML = '<option value="">Selecciona región</option>' + Object.keys(REGIONES).map(k=>`<option>${k}</option>`).join("");
  r.addEventListener("change", () => {
    const list = REGIONES[r.value] || [];
    c.innerHTML = '<option value="">Selecciona comuna</option>' + list.map(x=>`<option>${x}</option>`).join("");
  });
}

// ===== Storefront rendering =====
(function renderStorefront(){
  // Destacados en Home
  const dest = document.getElementById("destacados");
  if(dest){
    getProducts().slice(0,3).forEach(p => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <img loading="lazy" src="${p.img || 'img/banner-gamer.jpg'}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${CLP.format(p.precio)}</p>
        <button class="btn-primary" data-add="${p.id}">Añadir al carrito</button>
      `;
      dest.appendChild(el);
    });
    dest.addEventListener("click",(e)=>{
      const id = e.target.dataset.add;
      if(id) agregarCarrito(parseInt(id,10));
    });
  }

  // Lista de productos
  const cont = document.getElementById("productos");
  if(cont){
    const input = document.getElementById("busqueda");
    const cat = document.getElementById("filtroCategoria");

    // Leer categoría desde #hash (ej: productos.html#Accesorios)
    const hashCat = decodeURIComponent((location.hash || "").slice(1));
    if (hashCat && cat) {
      Array.from(cat.options).forEach(o => { if (o.value === hashCat) cat.value = hashCat; });
    }
    window.addEventListener("hashchange", () => {
      const hc = decodeURIComponent((location.hash || "").slice(1));
      if(hc && cat){ cat.value = hc; }
      draw();
    });

    function draw(){
      cont.innerHTML = "";
      let list = getProducts();
      const q = (input?.value || "").toLowerCase();
      const categoria = cat?.value || "";
      if(q){ list = list.filter(p => p.nombre.toLowerCase().includes(q)); }
      if(categoria){ list = list.filter(p => p.categoria === categoria); }
      list.forEach(p => {
        const d = document.createElement("div");
        d.className = "card";
        const stockWarn = (p.stockCritico!=null && p.stock<=p.stockCritico) ? `<span class="hint">⚠️ Stock crítico</span>` : "";
        d.innerHTML = `
          <img loading="lazy" src="${p.img || 'img/banner-gamer.jpg'}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>${CLP.format(p.precio)} · Stock: ${p.stock} ${stockWarn}</p>
          <button class="btn-primary" data-add="${p.id}">Añadir al carrito</button>
        `;
        cont.appendChild(d);
      });
    }
    input?.addEventListener("input", draw);
    cat?.addEventListener("change", draw);
    cont.addEventListener("click",(e)=>{
      const id = e.target.dataset.add;
      if(id) agregarCarrito(parseInt(id,10));
    });
    draw();
  }
})();

// Carrito
function agregarCarrito(id){
  const prods = getProducts();
  const p = prods.find(x=>x.id===id);
  if(!p){ alert("Producto no encontrado"); return; }
  const cart = getCart();
  cart.push({ id:p.id, nombre:p.nombre, precio:p.precio });
  saveCart(cart);
  updateCartBadge();
  alert("Producto añadido al carrito");
}

// ===== Validaciones Vistas =====

// Registro
(function registro(){
  const form = document.getElementById("formRegistro");
  if(!form) return;
  cargarRegiones("region","comuna");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const run = document.getElementById("rRun").value.trim().toUpperCase();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const pass = document.getElementById("password").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if(!validarRUN(run)){ alert("RUN inválido. Debe ser sin puntos ni guion. Ej: 19011022K"); return; }
    if(!/@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo)){ alert("Correo no permitido"); return; }
    if(pass.length<4 || pass.length>10){ alert("Contraseña entre 4 y 10 caracteres"); return; }
    if(direccion.length>300){ alert("Dirección excede 300 caracteres"); return; }

    const users = getUsers();
    const exists = users.some(u=>u.correo===correo || u.run===run);
    if(exists){ alert("Usuario ya existe"); return; }
    const newUser = {
      id: (users.at(-1)?.id || 0) + 1,
      run, nombre, apellidos, correo, pass, tipo:"Cliente", direccion
    };
    users.push(newUser); saveUsers(users);
    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
  });
})();

// Login
(function login(){
  const form = document.getElementById("formLogin");
  if(!form) return;
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const correo = document.getElementById("loginCorreo").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const users = getUsers();
    const u = users.find(x=>x.correo===correo && x.pass===pass);
    if(!u){ alert("Credenciales inválidas"); return; }
    localStorage.setItem(LS_KEYS.SESSION, JSON.stringify({ id:u.id, nombre:u.nombre, tipo:u.tipo, correo:u.correo }));
    alert(`Bienvenido ${u.nombre} (${u.tipo})`);
    if(u.tipo==="Administrador" || u.tipo==="Vendedor"){
      window.location.href = "admin/index.html";
    }else{
      window.location.href = "index.html";
    }
  });
})();

// Contacto
(function contacto(){
  const form = document.getElementById("formContacto");
  if(!form) return;
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const nombre = document.getElementById("cNombre").value.trim();
    const correo = document.getElementById("cCorreo").value.trim();
    const comentario = document.getElementById("cComentario").value.trim();
    if(nombre.length>100){ alert("Nombre supera 100 caracteres"); return; }
    if(!/@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo)){ alert("Correo no permitido"); return; }
    if(comentario.length>500){ alert("Comentario supera 500 caracteres"); return; }
    alert("📨 Mensaje enviado correctamente");
    e.target.reset();
  });
})();

// ===== Admin Guards & CRUD =====
function getSession(){ try{ return JSON.parse(localStorage.getItem(LS_KEYS.SESSION)) }catch{return null} }
function requireRole(roles){
  const s = getSession();
  if(!s || !roles.includes(s.tipo)){
    alert("Acceso restringido. Inicia sesión con perfil autorizado.");
    window.location.href = "../login.html";
  }
}

// Admin Productos
(function adminProductos(){
  const table = document.getElementById("tablaProductos");
  if(!table) return;
  requireRole(["Administrador","Vendedor"]);
  const form = document.getElementById("formProducto");
  const btnLimpiar = document.getElementById("btnLimpiar");

  function draw(){
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    getProducts().forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td><td>${p.codigo}</td><td>${p.nombre}</td>
        <td>${CLP.format(p.precio)}</td>
        <td>${p.stock}${(p.stockCritico!=null && p.stock<=p.stockCritico)?' ⚠️':''}</td>
        <td>${p.categoria}</td>
        <td>${p.img?'<a href="'+p.img+'" target="_blank">Ver</a>':'-'}</td>
        <td>
          <button data-editar="${p.id}">Editar</button>
          <button data-borrar="${p.id}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }
  draw();

  function clearForm(){ ["pCodigo","pNombre","pDesc","pPrecio","pStock","pStockCritico","pCategoria","pImagen","pId"].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=""; }); }
  btnLimpiar.addEventListener("click", clearForm);

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const codigo = document.getElementById("pCodigo").value.trim();
    const nombre = document.getElementById("pNombre").value.trim();
    const desc = document.getElementById("pDesc").value.trim();
    const precio = parseFloat(document.getElementById("pPrecio").value);
    const stock = parseInt(document.getElementById("pStock").value,10);
    const stockCriticoStr = document.getElementById("pStockCritico").value;
    const stockCritico = stockCriticoStr === "" ? null : parseInt(stockCriticoStr,10);
    const categoria = document.getElementById("pCategoria").value;
    const img = document.getElementById("pImagen").value.trim();
    const pid = document.getElementById("pId").value;

    if(codigo.length<3){ alert("Código: mínimo 3"); return; }
    if(nombre.length===0 || nombre.length>100){ alert("Nombre requerido (max 100)"); return; }
    if(desc.length>500){ alert("Descripción excede 500"); return; }
    if(!(precio>=0)){ alert("Precio debe ser ≥ 0"); return; }
    if(!(Number.isInteger(stock) && stock>=0)){ alert("Stock entero ≥ 0"); return; }
    if(stockCritico!=null && !(Number.isInteger(stockCritico) && stockCritico>=0)){ alert("Stock crítico entero ≥ 0"); return; }
    if(!categoria){ alert("Selecciona categoría"); return; }

    const list = getProducts();
    const isEdit = Boolean(pid);
    // Evitar duplicados por código (case-insensitive)
    const existsCodigo = list.some(x => x.codigo.toLowerCase() === codigo.toLowerCase() && (!isEdit || x.id !== parseInt(pid,10)));
    if (existsCodigo) { alert("Código de producto ya existe"); return; }

    if(isEdit){
      const id = parseInt(pid,10);
      const idx = list.findIndex(x=>x.id===id);
      if(idx>=0){
        list[idx] = { ...list[idx], codigo, nombre, descripcion:desc, precio, stock, stockCritico, categoria, img };
      }
    }else{
      const id = (list.at(-1)?.id || 0)+1;
      list.push({ id, codigo, nombre, descripcion:desc, precio, stock, stockCritico, categoria, img });
    }
    saveProducts(list);
    draw();
    clearForm();
    alert("✅ Producto guardado");
  });

  table.addEventListener("click",(e)=>{
    const idE = e.target.dataset.editar;
    const idB = e.target.dataset.borrar;
    if(idE){
      const id = parseInt(idE,10);
      const p = getProducts().find(x=>x.id===id);
      if(!p) return;
      document.getElementById("pCodigo").value = p.codigo;
      document.getElementById("pNombre").value = p.nombre;
      document.getElementById("pDesc").value = p.descripcion || "";
      document.getElementById("pPrecio").value = p.precio;
      document.getElementById("pStock").value = p.stock;
      document.getElementById("pStockCritico").value = (p.stockCritico ?? "");
      document.getElementById("pCategoria").value = p.categoria;
      document.getElementById("pImagen").value = p.img || "";
      document.getElementById("pId").value = p.id;
      window.scrollTo({top:0, behavior:"smooth"});
    }
    if(idB){
      const id = parseInt(idB,10);
      if(confirm("¿Eliminar producto?")){
        const list = getProducts().filter(x=>x.id!==id);
        saveProducts(list);
        draw();
      }
    }
  });
})();

// Admin Usuarios
(function adminUsuarios(){
  const table = document.getElementById("tablaUsuarios");
  if(!table) return;
  requireRole(["Administrador"]); // Solo Admin
  const form = document.getElementById("formUsuario");
  const btnLimpiar = document.getElementById("btnULimpiar");

  function draw(){
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    getUsers().forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.run}</td>
        <td>${u.nombre} ${u.apellidos}</td>
        <td>${u.correo}</td>
        <td>${u.tipo}</td>
        <td>
          <button data-uedit="${u.id}">Editar</button>
          <button data-udel="${u.id}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }
  draw();

  function clearForm(){ ["uRun","uNombre","uApellidos","uCorreo","uPass","uDireccion","uTipo","uId"].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=""; }); }
  btnLimpiar.addEventListener("click", clearForm);

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const run = document.getElementById("uRun").value.trim().toUpperCase();
    const nombre = document.getElementById("uNombre").value.trim();
    const apellidos = document.getElementById("uApellidos").value.trim();
    const correo = document.getElementById("uCorreo").value.trim();
    const pass = document.getElementById("uPass").value.trim();
    const direccion = document.getElementById("uDireccion").value.trim();
    const tipo = document.getElementById("uTipo").value;
    const uid = document.getElementById("uId").value;

    if(!validarRUN(run)){ alert("RUN inválido"); return; }
    if(nombre.length===0 || nombre.length>50){ alert("Nombre (1-50)"); return; }
    if(apellidos.length===0 || apellidos.length>100){ alert("Apellidos (1-100)"); return; }
    if(!/@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo)){ alert("Correo no permitido"); return; }
    if(pass.length<4 || pass.length>10){ alert("Contraseña 4-10"); return; }
    if(direccion.length>300){ alert("Dirección máx 300"); return; }
    if(!["Administrador","Vendedor","Cliente"].includes(tipo)){ alert("Tipo inválido"); return; }

    const list = getUsers();
    if(uid){
      const id = parseInt(uid,10);
      const i = list.findIndex(x=>x.id===id);
      if(i>=0){
        // evitar duplicados
        if(list.some(x=> (x.id!==id) && (x.correo===correo || x.run===run) )){ alert("RUN o correo ya registrado"); return; }
        list[i] = { ...list[i], run, nombre, apellidos, correo, pass, direccion, tipo };
      }
    }else{
      if(list.some(x=> x.correo===correo || x.run===run )){ alert("RUN o correo ya registrado"); return; }
      const id = (list.at(-1)?.id || 0)+1;
      list.push({ id, run, nombre, apellidos, correo, pass, direccion, tipo });
    }
    saveUsers(list);
    draw();
    clearForm();
    alert("✅ Usuario guardado");
  });

  table.addEventListener("click",(e)=>{
    const idE = e.target.dataset.uedit;
    const idD = e.target.dataset.udel;
    if(idE){
      const id = parseInt(idE,10);
      const u = getUsers().find(x=>x.id===id);
      if(!u) return;
      document.getElementById("uRun").value = u.run;
      document.getElementById("uNombre").value = u.nombre;
      document.getElementById("uApellidos").value = u.apellidos;
      document.getElementById("uCorreo").value = u.correo;
      document.getElementById("uPass").value = u.pass;
      document.getElementById("uDireccion").value = u.direccion;
      document.getElementById("uTipo").value = u.tipo;
      document.getElementById("uId").value = u.id;
      window.scrollTo({top:0, behavior:"smooth"});
    }
    if(idD){
      const id = parseInt(idD,10);
      if(confirm("¿Eliminar usuario?")){
        const list = getUsers().filter(x=>x.id!==id);
        saveUsers(list);
        draw();
      }
    }
  });
})();



// ===== Descuentos, Envío y Carrito (vista) =====
function getSession(){ try{ return JSON.parse(localStorage.getItem(LS_KEYS.SESSION)) }catch{return null} }
function duocDiscountRate(){
  const s = getSession();
  const mail = s?.correo || "";
  return /@(duoc\.cl|profesor\.duoc\.cl)$/i.test(mail) ? 0.20 : 0;
}
function getShipping(){ try{ return JSON.parse(localStorage.getItem('shippingAddress')) }catch{return null} }
function saveShipping(obj){ localStorage.setItem('shippingAddress', JSON.stringify(obj||{})); }
function groupCart(){
  const map = new Map();
  getCart().forEach(item=>{
    const key = item.id;
    const g = map.get(key) || { id:item.id, nombre:item.nombre, precio:item.precio, qty:0 };
    g.qty += 1;
    map.set(key, g);
  });
  return Array.from(map.values());
}
function setQty(id, qty){
  qty = Math.max(0, parseInt(qty||0,10));
  const cart = getCart().filter(it=>it.id!==id);
  for(let i=0;i<qty;i++){
    const prod = getProducts().find(p=>p.id===id);
    if(prod) cart.push({id:prod.id, nombre:prod.nombre, precio:prod.precio});
  }
  saveCart(cart);
  updateCartBadge();
}
function removeItem(id){
  const cart = getCart();
  const idx = cart.findIndex(it=>it.id===id);
  if(idx>=0){ cart.splice(idx,1); saveCart(cart); updateCartBadge(); }
}
function clearCart(){ saveCart([]); updateCartBadge(); }
function cartTotals(){
  const groups = groupCart();
  const subtotal = groups.reduce((s,g)=>s+g.precio*g.qty,0);
  const rate = duocDiscountRate();
  const discount = Math.round(subtotal*rate);
  const total = subtotal - discount;
  return { subtotal, rate, discount, total };
}
(function carritoPage(){
  const listEl = document.getElementById('cartList');
  const sumEl  = document.getElementById('cartSummary');
  if(!listEl || !sumEl) return;
  function renderList(){
    const groups = groupCart();
    if(groups.length===0){
      listEl.innerHTML = '<div class="card p">Tu carrito está vacío. <a href="productos.html">Ir al catálogo</a></div>';
      sumEl.innerHTML = '';
      return;
    }
    listEl.innerHTML = groups.map(g=>`
      <div class="card p" style="display:grid; grid-template-columns: 1fr auto; align-items:center; gap:12px;">
        <div>
          <div><strong>${g.nombre}</strong></div>
          <div class="muted">ID ${g.id}</div>
          <div>${CLP.format(g.precio)} c/u</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <label class="muted">Cantidad</label>
          <input type="number" min="0" value="${g.qty}" data-qty="${g.id}" style="width:80px">
          <button class="btn-secondary" data-del="${g.id}">Quitar uno</button>
        </div>
      </div>
    `).join('');
  }
  
function renderSummary(){
    const t = cartTotals();
    const ship = getShipping() || { nombre:"", direccion:"", comuna:"", region:"", depto:"", casa:"", receptor:"" };
    sumEl.innerHTML = `
      <h3>Resumen</h3>
      <div class="stack">
        <div class="line"><span>Subtotal</span><strong>${CLP.format(t.subtotal)}</strong></div>
        <div class="line"><span>Descuento ${t.rate>0? '(DUOC 20%)':''}</span><strong>-${CLP.format(t.discount)}</strong></div>
        <div class="line total"><span>Total</span><strong>${CLP.format(t.total)}</strong></div>
      </div>
      <hr>
      <h3>Envío</h3>
      <form id="shipForm" class="stack">
        <input name="nombre" placeholder="Nombre de quien recibe" value="${ship.nombre||''}" maxlength="100" required>
        <input name="direccion" id="shipAddr" placeholder="Dirección (calle y número)" value="${ship.direccion||''}" maxlength="300" required>

        <div style="display:flex; gap:8px; align-items:center;">
          <button class="btn-secondary" type="button" id="btnElegirMapa">Elegir en el mapa</button>
          <span class="muted">Haz click en el mapa para poner el punto exacto</span>
        </div>

        <div id="mapPanel" class="card p" style="display:none">
          <div id="map" style="width:100%; height:320px; border-radius:12px;"></div>
          <div class="muted" style="margin-top:8px">Click en el mapa para marcar. Luego presiona “Usar este punto”.</div>
          <div style="display:flex; gap:8px; margin-top:8px">
            <button class="btn-primary" type="button" id="btnUsarPunto">Usar este punto</button>
            <button class="btn-secondary" type="button" id="btnCerrarMapa">Cancelar</button>
          </div>
        </div>

        <input type="hidden" name="lat" id="shipLat" value="${ship.lat||''}">
        <input type="hidden" name="lng" id="shipLng" value="${ship.lng||''}">

        <div id="detallePanel" style="display:${ship.lat && ship.lng ? 'block':'none'}">
          <table class="table" style="margin-top:10px">
            <caption>Dirección seleccionada</caption>
            <tbody>
              <tr><th>Dirección</th><td id="tdDireccion">${ship.direccion||''}</td></tr>
              <tr><th>Coordenadas</th><td id="tdCoords">${ship.lat||''}, ${ship.lng||''}</td></tr>
            </tbody>
          </table>

          <table class="table" style="margin-top:10px">
            <caption>Información extra</caption>
            <tbody>
              <tr><th>Departamento</th><td><input name="depto" value="${ship.depto||''}" placeholder="Ej: Torre B, 1204"></td></tr>
              <tr><th>Casa</th><td><input name="casa" value="${ship.casa||''}" placeholder="Ej: Pasaje Z, N° 45"></td></tr>
              <tr><th>Quien recibe</th><td><input name="receptor" value="${ship.receptor||''}" placeholder="Nombre de recepción"></td></tr>
              <tr><th>Comuna</th><td><input name="comuna" value="${ship.comuna||''}"></td></tr>
              <tr><th>Región</th><td><input name="region" value="${ship.region||''}"></td></tr>
            </tbody>
          </table>
        </div>

        <button class="btn-primary" id="checkoutBtn" type="submit">Confirmar y pagar</button>
      </form>
      <p class="muted">* Si iniciaste sesión con correo institucional DUOC, se aplica 20% OFF automáticamente.</p>
    `;

    const form = document.getElementById('shipForm');
    const addr = document.getElementById('shipAddr');
    const detallePanel = document.getElementById('detallePanel');
    const hiddenLat = document.getElementById('shipLat');
    const hiddenLng = document.getElementById('shipLng');
    const tdDireccion = document.getElementById('tdDireccion');
    const tdCoords = document.getElementById('tdCoords');

    // Mapa Leaflet
    const btnElegirMapa = document.getElementById('btnElegirMapa');
    const mapPanel = document.getElementById('mapPanel');
    const btnUsarPunto = document.getElementById('btnUsarPunto');
    const btnCerrarMapa = document.getElementById('btnCerrarMapa');
    let map, marker, lastPoint=null;

    function openMap(){
      mapPanel.style.display = 'block';
      if(!map){
        map = L.map('map').setView([-33.45,-70.6667], 12); // Santiago
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        map.on('click', (e)=>{
          lastPoint = e.latlng;
          if(!marker){ marker = L.marker(lastPoint).addTo(map); }
          else{ marker.setLatLng(lastPoint); }
        });
      } else {
        setTimeout(()=>{ map.invalidateSize(); }, 150);
      }
    }

    btnElegirMapa.addEventListener('click', openMap);
    btnCerrarMapa.addEventListener('click', ()=>{ mapPanel.style.display='none'; });

    btnUsarPunto.addEventListener('click', ()=>{
      if(!lastPoint){ alert('Primero haz click en el mapa para colocar el punto.'); return; }
      hiddenLat.value = lastPoint.lat.toFixed(6);
      hiddenLng.value = lastPoint.lng.toFixed(6);
      tdCoords.textContent = hiddenLat.value + ', ' + hiddenLng.value;
      tdDireccion.textContent = addr.value.trim();
      detallePanel.style.display = 'block';
      mapPanel.style.display = 'none';
    });

    addr.addEventListener('input', ()=>{
      tdDireccion && (tdDireccion.textContent = addr.value.trim());
    });

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const obj = Object.fromEntries(fd.entries());
      if(!obj.direccion){ alert('Indica tu dirección de envío.'); return; }
      if(!(obj.lat && obj.lng)){ alert('Por favor selecciona el punto exacto en el mapa.'); return; }
      saveShipping(obj);
      alert('¡Compra confirmada! Gracias por tu pedido 🛒');
      clearCart();
      renderAll();
    });
  }
function renderAll(){ renderList(); renderSummary(); }
  listEl.addEventListener('input', (e)=>{
    const id = parseInt(e.target.dataset.qty||"0",10);
    if(id){ setQty(id, e.target.value); renderAll(); }
  });
  listEl.addEventListener('click', (e)=>{
    const id = parseInt(e.target.dataset.del||"0",10);
    if(id){ removeItem(id); renderAll(); }
  });
  renderAll();

  // Aviso cuando se abre con file:// y no se ve el carrito compartido
  if(location.protocol === 'file:'){
    const groups = groupCart();
    if(groups.length===0){
      const warn = document.createElement('div');
      warn.className = 'card p';
      warn.innerHTML = `<strong>Nota:</strong> Estás abriendo el sitio con <code>file://</code>. 
      Algunos navegadores aíslan el <em>localStorage</em> por archivo o ruta y el carrito puede aparecer vacío.
      Abre el proyecto con un servidor local (ej: VS Code Live Server o <code>python -m http.server</code>) para que el carrito funcione entre páginas.`;
      listEl.appendChild(warn);
    }
  }
})();
