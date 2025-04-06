
IDE: Cursor
Modelo: Claude 3.7 Sonet

# PROMPT 1

    Eres un experto en Nodejs con conocimientos en testing con jest.

    Nos han pedido desarrollar los tests unitarios del backend de la aplicación @backend .

    Entiende toda la funcionalidad del aplicativo para seguir después mis indicaciones para desarrollar los tests.

    No escribas ningún código todavía.

# PROMPT 2

    Vamos a enfocarnos primero en los tests de la capa de aplicación. 

    Qué pasos vas a seguir para implementar los tests? Antes de escribir nada vamos a analizar el flujo paso a paso para poder entenderlo mejor.

# PROMPT 3

    Vamos a empezar con el test del validador. 

    Solo vamos a desarrolalr el test de validateCandidateData, ya que el resto de métodos son usados por ese método.

    Usaremos el archvo @tests-BRT.test.ts para el desarrollo de los tests. 

    Dime antes de escribir nada qué tests vas a desarrollar y te diré cuales son necesarios.

# PROMPT 4

    Ok, vamos a desarrollar los tests.
 
    Simplifica el código todo lo posible.

    Escribe comentarios en cada test para entender mejor el objetivo de cada uno.

# PROMPT 5

    No, con esos sería suficiente.

    Podemos probarlos?


# PROMPT 6

    Perfecto! todos los tests están funcionando.

    Vamos a continuar con el resto de elementos de la aplicación. Vamos a validar ahora los modelos o entidades.


# PROMPT 7

    Vamos a validar solo los modelos, por ahora sin mockear, y comprobaremos solo que los campos de cada modelo se establecen y se recuperan correctamente.

    Dime que pasos vas a seguir con esta operación. No lo hagas hasta que no te confirme.

# PROMPT 8

    Vale, ahora vamos a agregar el test de @candidateService.ts Debes tener en cuenta que no debe afectar a la base de datos.

    No implementes nada todavía. Dime qué pasos vas a seguir.

# PROMPT 9

    Simplifica los casos a los más prioritarios.


# PROMPT 10

    Vale, vamos a implementarlo!