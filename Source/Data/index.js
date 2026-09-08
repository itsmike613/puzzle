const game = "PUZZLE";
const name = (en, es, ru) => ({ en, es, ru });

const images = [
    { id:"starrynight", file:"Source/Assets/Images/starrynight.jpg", name:name("Starry Night","La noche estrellada","Звёздная ночь") },
    { id:"americangothic", file:"Source/Assets/Images/americangothic.jpg", name:name("American Gothic","Gótico americano","Американская готика") },
    { id:"monalisa", file:"Source/Assets/Images/monalisa.jpg", name:name("Mona Lisa","La Gioconda","Мона Лиза") },
    { id:"lastsupper", file:"Source/Assets/Images/thelastsupper.jpg", name:name("The Last Supper","La Última Cena","Тайная вечеря") },
    { id:"pearlearring", file:"Source/Assets/Images/pearlearring.jpg", name:name("Girl with a Pearl Earring","La joven de la perla","Девушка с жемчужной серёжкой") },
    { id:"greatwave", file:"Source/Assets/Images/thegreatwave.jpg", name:name("The Great Wave off Kanagawa","La gran ola de Kanagawa","Большая волна в Канагаве") },
    { id:"scream", file:"Source/Assets/Images/thescream.jpg", name:name("The Scream","El grito","Крик") },
    { id:"washington", file:"Source/Assets/Images/washington.jpg", name:name("Washington Crossing the Delaware","Washington cruzando el Delaware","Вашингтон переправляется через Делавэр") },
    { id:"waterlily", file:"Source/Assets/Images/waterlilypond.jpg", name:name("The Water-Lily Pond","El estanque de nenúfares","Пруд с кувшинками") },
    { id:"goldengate", file:"Source/Assets/Images/goldengatebridge.jpg", name:name("Golden Gate Bridge","Puente Golden Gate","Мост Золотые Ворота") },
    { id:"timessquare", file:"Source/Assets/Images/timessquare.jpg", name:name("Times Square","Times Square","Таймс-сквер") },
    { id:"napali", file:"Source/Assets/Images/napalicoast.jpg", name:name("Nā Pali Coast","Costa de Nā Pali","Побережье На-Пали") },
    { id:"bliss", file:"Source/Assets/Images/bliss.jpg", name:name("Bliss (Bucolic Green Hills)","Bliss (colinas verdes bucólicas)","Bliss (буколические зелёные холмы)") },
    { id:"system", file:"Source/Assets/Images/system.jpg", name:name("System 1743","System 1743","System 1743") },
    { id:"capitol", file:"Source/Assets/Images/capitol.jpg", name:name("Capitol","Capitolio","Капитолий") }
];

const grids = [2, 3, 4, 5, 6, 7, 8];
const shuffles = ["light", "medium", "heavy", "full"];
const toggles = ["on", "off"];

const words = {
    en: {
        tagline:"Can you reconstruct something efficiently?", play:"Play", settings:"Settings", help:"Help", home:"Home", back:"Back", setup:"Setup", start:"Start Puzzle", replay:"Replay",
        newround:"New Puzzle", image:"Image", imagehelp:"Choose the image you want to reconstruct.", playing:"Puzzle in progress", time:"Time", moves:"Moves", reference:"Reference",
        preferences:"Preferences", grid:"Grid", gridhelp:"Choose how many square pieces divide the image.", shuffle:"Shuffle", shufflehelp:"Sets the exact minimum-swap distance of the starting board.", referencehelp:"Show or hide a small completed-image reference during play.", lines:"Grid Lines", lineshelp:"Show or hide persistent tile boundaries.",
        light:"Light", medium:"Medium", heavy:"Heavy", full:"Full", on:"On", off:"Off", complete:"Puzzle complete", results:"Results", completion:"Completion Time", optimal:"Optimal Moves", efficiency:"Move Efficiency", configuration:"Configuration", pieces:"Pieces",
        guide:"Guide", how:"How to play", helpintro:"{game} is an image reconstruction game. Choose an image, then restore it by swapping two square tiles at a time.", controls:"Change Grid, Shuffle, Reference, and Grid Lines in Settings. During play, select one tile and then another to swap them. Selecting the same tile again deselects it.",
        timerhelp:"Time begins when the scrambled board is ready and stops on the solving move.", moveshelp:"Moves counts successful swaps between two different tiles.", optimalhelp:"Optimal Moves is the exact fewest swaps needed from the starting arrangement.", efficiencyhelp:"Move Efficiency compares Optimal Moves with the moves you used, capped at 100%.", finishhelp:"The puzzle is complete when every tile returns to its original position.",
        asset:"Image unavailable", puzzle:"Puzzle board"
    },
    es: {
        tagline:"¿Puedes reconstruir algo de forma eficiente?", play:"Jugar", settings:"Ajustes", help:"Ayuda", home:"Inicio", back:"Atrás", setup:"Configuración", start:"Iniciar puzzle", replay:"Repetir",
        newround:"Nuevo puzzle", image:"Imagen", imagehelp:"Elige la imagen que quieres reconstruir.", playing:"Puzzle en curso", time:"Tiempo", moves:"Movimientos", reference:"Referencia",
        preferences:"Preferencias", grid:"Cuadrícula", gridhelp:"Elige cuántas piezas cuadradas dividen la imagen.", shuffle:"Mezcla", shufflehelp:"Define la distancia mínima exacta de intercambios del tablero inicial.", referencehelp:"Muestra u oculta una pequeña referencia de la imagen completa durante el juego.", lines:"Líneas de cuadrícula", lineshelp:"Muestra u oculta los límites persistentes de las piezas.",
        light:"Ligera", medium:"Media", heavy:"Intensa", full:"Completa", on:"Activado", off:"Desactivado", complete:"Puzzle completado", results:"Resultados", completion:"Tiempo de finalización", optimal:"Movimientos óptimos", efficiency:"Eficiencia de movimientos", configuration:"Configuración", pieces:"Piezas",
        guide:"Guía", how:"Cómo jugar", helpintro:"{game} es un juego de reconstrucción de imágenes. Elige una imagen y restáurala intercambiando dos piezas cuadradas cada vez.", controls:"Cambia Cuadrícula, Mezcla, Referencia y Líneas de cuadrícula en Ajustes. Durante el juego, selecciona una pieza y luego otra para intercambiarlas. Seleccionar de nuevo la misma pieza la deselecciona.",
        timerhelp:"El tiempo comienza cuando el tablero mezclado está listo y se detiene con el movimiento que resuelve el puzzle.", moveshelp:"Movimientos cuenta los intercambios realizados entre dos piezas diferentes.", optimalhelp:"Movimientos óptimos es el número mínimo exacto de intercambios necesario desde la disposición inicial.", efficiencyhelp:"Eficiencia de movimientos compara los Movimientos óptimos con los que usaste, con un máximo del 100%.", finishhelp:"El puzzle se completa cuando cada pieza vuelve a su posición original.",
        asset:"Imagen no disponible", puzzle:"Tablero del puzzle"
    },
    ru: {
        tagline:"Сможете восстановить изображение эффективно?", play:"Играть", settings:"Настройки", help:"Помощь", home:"Главная", back:"Назад", setup:"Настройка", start:"Начать пазл", replay:"Повторить",
        newround:"Новый пазл", image:"Изображение", imagehelp:"Выберите изображение, которое хотите восстановить.", playing:"Пазл в процессе", time:"Время", moves:"Ходы", reference:"Образец",
        preferences:"Параметры", grid:"Сетка", gridhelp:"Выберите, на сколько квадратных частей делится изображение.", shuffle:"Перемешивание", shufflehelp:"Задаёт точное минимальное число обменов для начальной раскладки.", referencehelp:"Показывать или скрывать маленький образец собранного изображения во время игры.", lines:"Линии сетки", lineshelp:"Показывать или скрывать постоянные границы плиток.",
        light:"Лёгкое", medium:"Среднее", heavy:"Сильное", full:"Полное", on:"Вкл.", off:"Выкл.", complete:"Пазл собран", results:"Результаты", completion:"Время завершения", optimal:"Оптимальные ходы", efficiency:"Эффективность ходов", configuration:"Конфигурация", pieces:"Плитки",
        guide:"Справка", how:"Как играть", helpintro:"{game} — игра на восстановление изображения. Выберите картинку и соберите её, меняя местами по две квадратные плитки.", controls:"Параметры Сетка, Перемешивание, Образец и Линии сетки меняются в Настройках. Во время игры выберите одну плитку, затем вторую, чтобы поменять их местами. Повторный выбор той же плитки снимает выделение.",
        timerhelp:"Время начинается, когда перемешанная доска готова, и останавливается на решающем ходе.", moveshelp:"Ходы учитывают успешные обмены между двумя разными плитками.", optimalhelp:"Оптимальные ходы — точное минимальное число обменов, необходимое из начальной раскладки.", efficiencyhelp:"Эффективность ходов сравнивает Оптимальные ходы с использованными ходами и ограничивается 100%.", finishhelp:"Пазл завершён, когда каждая плитка возвращается на исходное место.",
        asset:"Изображение недоступно", puzzle:"Поле пазла"
    }
};

const howplay = [
    name("Choose an image on Setup.","Elige una imagen en Configuración.","Выберите изображение на экране настройки."),
    name("Adjust Grid, Shuffle, Reference, and Grid Lines in Settings.","Ajusta Cuadrícula, Mezcla, Referencia y Líneas de cuadrícula en Ajustes.","Настройте Сетку, Перемешивание, Образец и Линии сетки в Настройках."),
    name("Start the puzzle. The image is divided into square tiles and shuffled inside the board.","Inicia el puzzle. La imagen se divide en piezas cuadradas y se mezcla dentro del tablero.","Начните пазл. Изображение делится на квадратные плитки и перемешивается внутри поля."),
    name("Select one tile and then a second tile to swap them.","Selecciona una pieza y luego una segunda para intercambiarlas.","Выберите одну плитку, затем вторую, чтобы поменять их местами."),
    name("Use Time and Moves to track your run.","Usa Tiempo y Movimientos para seguir tu partida.","Следите за результатом по Времени и Ходам."),
    name("Restore every tile to its original position to finish.","Devuelve cada pieza a su posición original para terminar.","Верните все плитки на исходные места, чтобы завершить игру."),
    name("Review Completion Time, Moves, Optimal Moves, and Move Efficiency in Results.","Consulta Tiempo de finalización, Movimientos, Movimientos óptimos y Eficiencia de movimientos en Resultados.","Посмотрите Время завершения, Ходы, Оптимальные ходы и Эффективность ходов в Результатах.")
];

const topics = [
    { title:name("Time","Tiempo","Время"), text:name(words.en.timerhelp, words.es.timerhelp, words.ru.timerhelp) },
    { title:name("Moves","Movimientos","Ходы"), text:name(words.en.moveshelp, words.es.moveshelp, words.ru.moveshelp) },
    { title:name("Optimal Moves","Movimientos óptimos","Оптимальные ходы"), text:name(words.en.optimalhelp, words.es.optimalhelp, words.ru.optimalhelp) },
    { title:name("Move Efficiency","Eficiencia de movimientos","Эффективность ходов"), text:name(words.en.efficiencyhelp, words.es.efficiencyhelp, words.ru.efficiencyhelp) }
];