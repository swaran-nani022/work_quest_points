// save this as hash.js
import bcrypt from 'bcrypt';

const password = 'admin123'; // your desired admin password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hashed password:', hash);
});
