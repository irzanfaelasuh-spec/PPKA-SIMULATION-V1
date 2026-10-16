'use strict';
// DATA ILUSTRATIF: urutan stasiun mengacu geografi nyata; jarak, sinyal, nomor KA & jadwal = simulasi.
const LINES=[
{id:'J',n:'KRL Jakarta Kota – Bogor',hw:300,sp:4500,st:[['Jakarta Kota',0,1],['Jayakarta',1.3,0],['Mangga Besar',2.2,0],['Sawah Besar',3.2,0],['Juanda',4.5,0],['Gondangdia',5.6,0],['Cikini',6.6,0],['Manggarai',8.3,1],['Tebet',9.6,0],['Cawang',11.2,0],['Duren Kalibata',12.7,0],['Pasar Minggu',16,1],['Tanjung Barat',19.2,0],['Lenteng Agung',20.8,0],['Univ. Indonesia',25.2,0],['Pondok Cina',26.4,0],['Depok Baru',28.1,0],['Depok',29.6,1],['Citayam',34.4,0],['Bojong Gede',38.8,0],['Cilebut',43.5,0],['Bogor',54,1]]},
{id:'U',n:'Lintas Utara Jawa: Gambir – Semarang Tawang',hw:2200,sp:45000,st:[['Gambir',0,1],['Jatinegara',5,1],['Bekasi',22,0],['Cikampek',85,1],['Haurgeulis',150,0],['Jatibarang',205,0],['Cirebon',256,1],['Brebes',300,0],['Tegal',336,1],['Pekalongan',401,1],['Semarang Tawang',483,1]]},
{id:'S',n:'Lintas Selatan Jawa: Bandung – Surabaya Gubeng',hw:3000,sp:60000,st:[['Bandung',0,1],['Kiaracondong',5,0],['Cicalengka',30,0],['Tasikmalaya',160,1],['Banjar',205,0],['Kroya',330,1],['Purwokerto',380,1],['Kutoarjo',510,0],['Yogyakarta',570,1],['Solo Balapan',635,1],['Madiun',735,1],['Kertosono',795,0],['Jombang',820,0],['Mojokerto',855,0],['Surabaya Gubeng',915,1]]}];
const LC={CC201:'#d9822b',CC203:'#2c6db3',CC204:'#c7473a',CC205:'#3a9a68',CC206:'#2a4a94',EMU:'#9aa6b2'};
const FW=['#8a3b2e','#2e5a8a','#b8962e','#4f6b4a','#6a6f78'];
const T=(n,cat,loco,cars,body,band,kmh,ln,k='ka',dw=100)=>({n,cat,loco,cars,body,band,v:kmh/3.6,ln,k,dw});
const SV='#c9d1d9',EK='#2f5f9c',WH='#e8edf2',GD='#f0b429';
const TYPES=[
T('KRL Seri 205 (ex-JR East)','KRL','EMU',10,'#cfd6dc','#e63946',85,'J','krl',35),
T('KRL Seri 203 (ex-JR East)','KRL','EMU',8,'#c9d2d8','#3b6fc4',85,'J','krl',35),
T('KRL Seri 6000 (ex-Tokyo Metro)','KRL','EMU',10,'#cdd3d9','#3a9a68',85,'J','krl',35),
T('KRL Seri 05 (ex-Tokyo Metro)','KRL','EMU',10,'#d0d6dc','#3aa6b9',85,'J','krl',35),
T('KRL Seri 7000 (ex-Tokyo Metro)','KRL','EMU',10,'#cbd1d7','#e0a526',85,'J','krl',35),
T('KRL Seri 8500 (ex-Tokyu)','KRL','EMU',8,'#c8cfd6','#e07b39',85,'J','krl',35),
T('KRL Seri 8000 (ex-Tokyu)','KRL','EMU',8,'#cfd4d9','#8a82d6',85,'J','krl',35),
T('Argo Bromo Anggrek','Eksekutif','CC206',9,SV,'#b3202e',120,'U'),
T('Argo Muria','Eksekutif','CC206',8,SV,'#d29b2c',120,'U'),
T('Argo Sindoro','Eksekutif','CC206',8,SV,'#2b7bb9',120,'U'),
T('Sembrani','Eksekutif','CC206',10,SV,'#c25b2a',115,'U'),
T('Harina','Eksekutif','CC203',9,SV,'#3a9a68',110,'U'),
T('Cirebon Ekspres','Eksekutif','CC206',8,SV,'#6b8fb8',110,'U'),
T('Gumarang','Campuran','CC203',11,EK,WH,100,'U'),
T('Brantas','Ekonomi','CC201',11,EK,WH,95,'U'),
T('Kamandaka','Ekonomi','CC201',8,EK,WH,95,'U'),
T('Menoreh','Ekonomi','CC204',10,EK,GD,95,'U'),
T('Tawang Jaya','Ekonomi','CC204',10,EK,GD,95,'U'),
T('Tegal Bahari','Ekonomi','CC201',9,EK,WH,95,'U'),
T('Argo Wilis','Eksekutif','CC206',8,SV,'#2e8b6a',120,'S'),
T('Turangga','Eksekutif','CC206',10,SV,'#9a3b5c',120,'S'),
T('Bima','Eksekutif','CC206',10,SV,'#c4a13a',115,'S'),
T('Taksaka','Eksekutif','CC206',8,SV,'#b3202e',115,'S'),
T('Gajayana','Eksekutif','CC206',9,SV,'#2b7bb9',115,'S'),
T('Argo Lawu','Eksekutif','CC206',8,SV,'#d29b2c',120,'S'),
T('Argo Dwipangga','Eksekutif','CC206',8,SV,'#3aa6b9',120,'S'),
T('Sancaka','Campuran','CC203',9,'#bfc8d0','#3b6fc4',105,'S'),
T('Mutiara Selatan','Campuran','CC203',9,'#bfc8d0','#9a2f3a',105,'S'),
T('Lodaya','Campuran','CC203',8,'#bfc8d0','#2e8b6a',105,'S'),
T('Pasundan','Ekonomi','CC201',11,EK,WH,95,'S'),
T('Kahuripan','Ekonomi','CC201',11,EK,WH,95,'S'),
T('Kutojaya Selatan','Ekonomi','CC204',9,EK,GD,95,'S'),
T('Serayu','Ekonomi','CC204',10,EK,GD,95,'S'),
T('KA Peti Kemas','Barang','CC206',16,null,'#d8dde3',65,'US','frt'),
T('KA BBM Pertamina','Barang','CC203',14,'#2a2f36','#c0392b',60,'US','frt'),
T('KA Semen','Barang','CC201',15,'#8d939a','#556270',60,'US','frt'),
T('KA Batubara','Barang','CC204',20,'#1d2126','#3a4350',55,'US','frt'),
T('KA Pupuk','Barang','CC205',15,'#b0a58b','#6b6350',60,'US','frt')];
