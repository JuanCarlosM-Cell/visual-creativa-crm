import { PrismaClient, Role, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed...');

    // Limpiar base de datos
    await prisma.deliverableLink.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();

    // Crear usuarios
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin Visual Creativa',
            email: 'admin@visualcreativa.com',
            passwordHash: adminPassword,
            role: Role.admin,
        },
    });

    const user1 = await prisma.user.create({
        data: {
            name: 'María González',
            email: 'user1@visualcreativa.com',
            passwordHash: userPassword,
            role: Role.user,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Carlos Rodríguez',
            email: 'user2@visualcreativa.com',
            passwordHash: userPassword,
            role: Role.user,
        },
    });

    console.log('✅ Usuarios creados');

    // Crear clientes
    const client1 = await prisma.client.create({
        data: {
            name: 'Netflix Latinoamérica',
            company: 'Netflix Inc.',
            email: 'contacto@netflix.com',
            phone: '+52 55 1234 5678',
            notes: 'Cliente premium - Proyectos de alto presupuesto',
        },
    });

    const client2 = await prisma.client.create({
        data: {
            name: 'Coca-Cola México',
            company: 'The Coca-Cola Company',
            email: 'marketing@cocacola.mx',
            phone: '+52 55 8765 4321',
            notes: 'Campañas publicitarias trimestrales',
        },
    });

    const client3 = await prisma.client.create({
        data: {
            name: 'Spotify',
            company: 'Spotify AB',
            email: 'creative@spotify.com',
            phone: '+1 555 0123',
            notes: 'Contenido para artistas emergentes',
        },
    });

    console.log('✅ Clientes creados');

    // Crear proyectos
    const project1 = await prisma.project.create({
        data: {
            clientId: client1.id,
            name: 'Serie Documental "Sabores de México"',
            description: 'Producción de 6 episodios sobre gastronomía mexicana',
            status: ProjectStatus.Lead,
            dueDate: new Date('2025-03-15'),
            notes: 'Requiere equipo de 4K y drones',
        },
    });

    const project2 = await prisma.project.create({
        data: {
            clientId: client2.id,
            name: 'Campaña Verano 2025',
            description: 'Spots publicitarios para TV y redes sociales',
            status: ProjectStatus.Cotizacion,
            dueDate: new Date('2025-02-28'),
            notes: 'Presupuesto: $150,000 USD',
        },
    });

    const project3 = await prisma.project.create({
        data: {
            clientId: client2.id,
            name: 'Video Corporativo Aniversario',
            description: 'Video institucional para 100 años de Coca-Cola',
            status: ProjectStatus.EnProduccion,
            dueDate: new Date('2025-04-20'),
            notes: 'Incluye entrevistas a ejecutivos',
        },
    });

    const project4 = await prisma.project.create({
        data: {
            clientId: client3.id,
            name: 'Videoclip "Nuevo Talento"',
            description: 'Producción de videoclip para artista emergente',
            status: ProjectStatus.EnProduccion,
            dueDate: new Date('2025-01-30'),
            notes: 'Locación: Estudio A',
        },
    });

    const project5 = await prisma.project.create({
        data: {
            clientId: client3.id,
            name: 'Podcast Visual "Entre Notas"',
            description: 'Serie de 10 episodios con músicos latinos',
            status: ProjectStatus.Entregado,
            dueDate: new Date('2024-12-15'),
            notes: 'Proyecto completado exitosamente',
        },
    });

    const project6 = await prisma.project.create({
        data: {
            clientId: client1.id,
            name: 'Trailer "La Casa de las Flores 2"',
            description: 'Trailer promocional para nueva temporada',
            status: ProjectStatus.Entregado,
            dueDate: new Date('2024-11-30'),
            notes: 'Entregado antes de tiempo',
        },
    });

    console.log('✅ Proyectos creados');

    // Crear tareas para algunos proyectos
    await prisma.task.createMany({
        data: [
            { projectId: project3.id, title: 'Scouting de locaciones', done: true },
            { projectId: project3.id, title: 'Casting de actores', done: true },
            { projectId: project3.id, title: 'Grabación día 1', done: true },
            { projectId: project3.id, title: 'Grabación día 2', done: false },
            { projectId: project3.id, title: 'Post-producción', done: false },
            { projectId: project4.id, title: 'Reunión con artista', done: true },
            { projectId: project4.id, title: 'Diseño de escenografía', done: true },
            { projectId: project4.id, title: 'Grabación', done: false },
            { projectId: project4.id, title: 'Edición y color grading', done: false },
        ],
    });

    console.log('✅ Tareas creadas');

    // Crear links de entregables
    await prisma.deliverableLink.createMany({
        data: [
            {
                projectId: project5.id,
                label: 'Episodios finales',
                url: 'https://drive.google.com/drive/folders/podcast-final',
            },
            {
                projectId: project5.id,
                label: 'Material RAW',
                url: 'https://dropbox.com/raw-footage-podcast',
            },
            {
                projectId: project6.id,
                label: 'Trailer 4K',
                url: 'https://frame.io/trailer-casa-flores',
            },
            {
                projectId: project3.id,
                label: 'Dailies Semana 1',
                url: 'https://drive.google.com/dailies-week1',
            },
        ],
    });

    console.log('✅ Links de entregables creados');
    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📧 Credenciales de acceso:');
    console.log('Admin: admin@visualcreativa.com / Admin123!');
    console.log('User1: user1@visualcreativa.com / User123!');
    console.log('User2: user2@visualcreativa.com / User123!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
