// Importar el módulo jtest (solo para mantener la compatibilidad)
const jtest = require('jtest');

// Implementación simple de un framework de pruebas
const test = {
    test: function(description, callback) {
        console.log(`\n🧪 Ejecutando prueba: ${description}`);
        try {
            callback();
            console.log(`✅ Prueba "${description}" pasada correctamente`);
        } catch (error) {
            console.error(`❌ Prueba "${description}" fallida: ${error.message}`);
            process.exit(1);
        }
    },
    
    equal: function(actual, expected) {
        if (actual !== expected) {
            throw new Error(`Se esperaba ${expected}, pero se obtuvo ${actual}`);
        }
    }
};

function sum(a, b) {
    return a + b;
}

module.exports = {
    sum
};

// Ejecutar pruebas
test.test('sum', () => {
    test.equal(sum(1, 2), 3);
    console.log('La suma funciona correctamente');
});