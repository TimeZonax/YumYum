/* data.js - sample restaurants & initial data for prototype */
const RESTAURANTS = [
  {
    id: 'r1',
    name: 'ก๋วยเตี๋ยวเจ๊แดง',
    img: 'https://images.unsplash.com/photo-1604908176545-4e9e3b2a7f3c?q=80&w=800&auto=format&fit=crop',
    busy: 'busy', // busy / avail / normal
    featured: 'ก๋วยเตี๋ยวน้ำตก',
    menus: [
      { id:'m1', name:'ก๋วยเตี๋ยวน้ำตก', price:40, soldOut:false, rating:4.2, stars:25 },
      { id:'m2', name:'เกาเหลาหมู', price:45, soldOut:false, rating:4.0, stars:8 }
    ],
    votes: 4
  },
  {
    id: 'r2',
    name: 'ข้าวแกงแม่ลิน',
    img: 'https://images.unsplash.com/photo-1542736667-069246bdbc27?q=80&w=800&auto=format&fit=crop',
    busy: 'busy',
    featured: 'ข้าวหมูทอด',
    menus: [
      { id:'m3', name:'ข้าวหมูทอด', price:50, soldOut:false, rating:4.5, stars:50 },
      { id:'m4', name:'ผัดผักรวม', price:35, soldOut:false, rating:3.9, stars:6 }
    ],
    votes: 8
  },
  {
    id: 'r3',
    name: 'ฮาลาลซอสเดช',
    img: 'https://images.unsplash.com/photo-1601050690594-6d1b1c1f3b02?q=80&w=800&auto=format&fit=crop',
    busy: 'avail',
    featured: 'ข้าวหน้าไก่ฮาลาล',
    menus: [
      { id:'m5', name:'ข้าวหน้าไก่ฮาลาล', price:55, soldOut:false, rating:4.6, stars:40 },
      { id:'m6', name:'แกงเขียวหวาน', price:60, soldOut:true, rating:4.1, stars:12 }
    ],
    votes: 6
  }
];