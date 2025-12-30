import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const spanishNames = [
    'Carlos Rodríguez', 'María García', 'José Martínez', 'Ana López', 'Francisco Fernández',
    'Laura Sánchez', 'Antonio Pérez', 'Carmen González', 'Manuel Romero', 'Isabel Torres',
    'David Ruiz', 'Cristina Díaz', 'Javier Moreno', 'Elena Muñoz', 'Miguel Álvarez',
    'Patricia Jiménez', 'Pedro Hernández', 'Lucía Navarro', 'Alejandro Castro', 'Marta Ortiz',
    'Daniel Rubio', 'Sara Molina', 'Pablo Delgado', 'Andrea Morales', 'Sergio Suárez',
    'Raquel Ortega', 'Alberto Marín', 'Natalia Sanz', 'Rubén Iglesias', 'Silvia Núñez',
    'Adrián Medina', 'Beatriz Garrido', 'Iván Santos', 'Mónica Castillo', 'Óscar Guerrero',
    'Teresa Lozano', 'Víctor Ramírez', 'Pilar Méndez', 'Enrique Cruz', 'Rosa Vázquez',
    'Fernando Ramos', 'Dolores Gil', 'Luis Serrano', 'Amparo Blanco', 'Ángel Herrera',
    'Concepción Aguilar', 'Ramón Benítez', 'Josefa Vargas', 'Emilio Campos', 'Mercedes Reyes'
];

const positiveComments = [
    'Excelente herramienta, muy intuitiva y fácil de usar.',
    'Me encanta el diseño moderno y la rapidez del sistema.',
    'Perfecto para gestionar proyectos, lo recomiendo 100%.',
    'La función de arrastrar y soltar es genial, facilita mucho el trabajo.',
    'Muy completo, tiene todo lo que necesito para mi negocio.',
    'Interfaz limpia y profesional, se nota la calidad.',
    'El sistema de notificaciones por email funciona de maravilla.',
    'Impresionante la velocidad de carga, todo es instantáneo.',
    'Ideal para equipos pequeños y medianos, muy recomendable.',
    'La organización por estados (Lead, Cotización, etc.) es muy práctica.',
];

const constructiveComments = [
    'Muy bueno en general, aunque me gustaría más opciones de personalización.',
    'Funciona bien, pero sería genial tener reportes más detallados.',
    'Buen sistema, aunque la curva de aprendizaje inicial es un poco pronunciada.',
    'Me gusta, pero echo de menos integración con otras herramientas.',
    'Cumple su función, aunque podría mejorar en la gestión de archivos.',
    'Buena experiencia, pero necesitaría más filtros en las búsquedas.',
    'Interesante propuesta, aunque algunos botones podrían ser más visibles.',
    'Funcional y útil, pero me gustaría poder exportar datos a Excel.',
];

const neutralComments = [
    'Cumple con lo esperado, es una herramienta sólida.',
    'Interesante sistema, aún lo estoy explorando.',
    'Buena opción para gestión de proyectos.',
    'Funciona correctamente, sin problemas hasta ahora.',
];

async function main() {
    console.log('🌱 Generando 50 encuestas de prueba...');

    const surveys = [];

    for (let i = 0; i < 50; i++) {
        const name = spanishNames[i];
        const email = i % 3 === 0 ? `${name.toLowerCase().replace(/ /g, '.')}@example.com` : undefined;

        // Distribución realista de calificaciones (mayoría positivas)
        let satisfactionRating: number;
        let easeOfUseRating: number;
        let wouldRecommend: boolean;
        let comments: string | undefined;

        const rand = Math.random();
        if (rand < 0.5) {
            // 50% - Muy satisfechos (5 estrellas)
            satisfactionRating = 5;
            easeOfUseRating = Math.random() < 0.7 ? 5 : 4;
            wouldRecommend = true;
            comments = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        } else if (rand < 0.85) {
            // 35% - Satisfechos (4 estrellas)
            satisfactionRating = 4;
            easeOfUseRating = Math.random() < 0.5 ? 4 : 5;
            wouldRecommend = Math.random() < 0.9;
            comments = Math.random() < 0.7
                ? positiveComments[Math.floor(Math.random() * positiveComments.length)]
                : constructiveComments[Math.floor(Math.random() * constructiveComments.length)];
        } else if (rand < 0.95) {
            // 10% - Neutrales (3 estrellas)
            satisfactionRating = 3;
            easeOfUseRating = 3;
            wouldRecommend = Math.random() < 0.5;
            comments = Math.random() < 0.5
                ? neutralComments[Math.floor(Math.random() * neutralComments.length)]
                : constructiveComments[Math.floor(Math.random() * constructiveComments.length)];
        } else {
            // 5% - Insatisfechos (1-2 estrellas)
            satisfactionRating = Math.random() < 0.5 ? 2 : 1;
            easeOfUseRating = Math.random() < 0.5 ? 2 : 3;
            wouldRecommend = false;
            comments = constructiveComments[Math.floor(Math.random() * constructiveComments.length)];
        }

        // Distribuir fechas en los últimos 30 días
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);

        surveys.push({
            name,
            email,
            satisfactionRating,
            easeOfUseRating,
            wouldRecommend,
            comments,
            createdAt,
        });
    }

    // Crear todas las encuestas
    for (const survey of surveys) {
        await prisma.survey.create({ data: survey });
    }

    console.log('✅ 50 encuestas creadas exitosamente!');

    // Mostrar estadísticas
    const avgSatisfaction = surveys.reduce((sum, s) => sum + s.satisfactionRating, 0) / surveys.length;
    const avgEaseOfUse = surveys.reduce((sum, s) => sum + s.easeOfUseRating, 0) / surveys.length;
    const recommendCount = surveys.filter(s => s.wouldRecommend).length;

    console.log('\n📊 Estadísticas generadas:');
    console.log(`Total de respuestas: ${surveys.length}`);
    console.log(`Satisfacción promedio: ${avgSatisfaction.toFixed(1)}/5 ⭐`);
    console.log(`Facilidad de uso promedio: ${avgEaseOfUse.toFixed(1)}/5 ⭐`);
    console.log(`Recomendarían: ${recommendCount}/${surveys.length} (${(recommendCount / surveys.length * 100).toFixed(1)}%)`);
}

main()
    .catch((e) => {
        console.error('❌ Error generando encuestas:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
