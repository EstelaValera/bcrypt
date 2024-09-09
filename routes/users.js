const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const users = require('../data/users');  

const setup = (app) => {
app.get('/', (req, res) => {

    if (req.session.token) {
    const dashboardPage = `
        <h2>Ya has iniciado sesión</h2>

        <a href="/dashboard" class="dashboard-link">Ir al Dashboard</a>

        <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
        </form>
    `;
    
    res.send(dashboardPage);
    } else { 
    const loginform = `
    <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>
    
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>
    
        <button type="submit">Iniciar sesión</button>
    </form>

    <a href="/dashboard" class="dashboard-link">Dashboard</a>
    `;
    res.send(loginform);
    }
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
    const token = generateToken(user);
    req.session.token = token;
    res.redirect('/dashboard');
    } else {
    res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
});


app.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
    res.send(`
    <h1>Hola, ${user.name}</h1>
        <p>ID: ${user.id}</p>
        <p>Username: ${user.username}</p>
        <a href="/" class="home-link">Volver a Inicio</a>
        <form action="/logout" method="post">
        <button class="logout-btn" type="submit">Cerrar sesión</button>
        </form>
        `);
    } else {
    res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
});


app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
};

module.exports = setup;