## 🌐 SSH-Projekti – Frontend

**Lënda:** Sistemet e Shpërndara 2024/2025
**Moduli:** Frontend i një platforme multi-tenant për menaxhimin e makinave me qira
**Teknologji:** HTML, CSS, JavaScript (Vanilla JS)

---

## 📖 Përshkrimi

Frontend-i i SSH-Projekti ofron një ndërfaqe të thjeshtë dhe të përdorshme për menaxhimin e përdoruesve, rezervimeve dhe makinave për një platformë rent-a-car me arkitekturë multi-tenant. Ai ndërvepron me REST API-n e backend-it përmes thirrjeve `fetch()` dhe përdor `localStorage` për ruajtjen e të dhënave si token-i i autentikimit.

---

## 🛠️ Teknologjitë e përdorura

| Teknologji             | Përshkrim                              |
| ---------------------- | -------------------------------------- |
| **HTML5**              | Strukturimi i faqeve                   |
| **CSS3**               | Stilizimi dhe responsive design        |
| **JavaScript**         | Logjika e aplikacionit dhe thirrje API |
| **EmailJS** (opsional) | Dërgim email-i për reset password      |

---

## 🚀 Instalimi dhe Përdorimi

Nuk ka nevojë për ndonjë server lokal për frontend-in. Thjesht hap `index.html` në shfletuesin tënd ose përdor një server të thjeshtë si:

```bash
# Me Python
python3 -m http.server

# Me Live Server në VS Code
```

Sigurohu që `backend` të jetë aktiv në `http://localhost:3000`.

---

## 🔐 Autentikimi

* Përdoret `fetch()` për të dërguar kredencialet te backend API
* Pas login-it, `access_token`, `userId`, `role` dhe `tenant_id` ruhen në `localStorage`
* Përdoruesi ridrejtohet në dashboard bazuar në rolin e tij

---

## 📋 Funksionalitete të mbuluara

✅ Regjistrimi dhe login
✅ Dashboard për role të ndryshme
✅ Shtimi, fshirja dhe editimi i rezervimeve
✅ Lista e makinave në dispozicion
✅ Logout dhe mbrojtje nga hyrje të paautorizuara
✅ Interaktivitet me DOM dhe validime bazike

---

## 🧠 Menaxhimi i Kontekstit

* Nuk përdoret React, por `localStorage` dhe kontroll logjike me `JavaScript` për të menaxhuar se kush është i kyçur dhe çfarë roli ka
* Shembull kontrolli:

```js
const role = localStorage.getItem('role');
if (role !== 'Admin') window.location.href = '/login.html';
```

---

## 🧾 Komanda të dobishme

| Veprim                  | Metodë                                  |
| ----------------------- | --------------------------------------- |
| Startimi lokal          | `python3 -m http.server` ose LiveServer |
| Pastrimi i localStorage | `localStorage.clear()` në Console       |
| Kontrolli i token-it    | `localStorage.getItem('token')`         |
