import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { TasksService } from "../api/tasks.service";
import { TodoListPageComponent } from "../pages/todo-list-page.component";
import { TaskFormComponent } from "../task-form.component";
import { TodoListComponent } from "../todo-list.component";

// Créons une suite de tests qui validera le fonctionnement
// du TodoListPageComponent 
describe("TodoListPageComponent", () => {
    // La fixture nous permettra d'analyser le rendu HTML
    // et de le piloter (simuler des événements etc)
    let fixture: ComponentFixture<TodoListPageComponent>;

    // Avant chaque test de cette suite 
    beforeEach(async () => {
        // On configure un *faux* module qui enveloppera notre
        // composant et lui fournira les outils dont il a besoin
        await TestBed.configureTestingModule({
            // Déclarons les composants nécessaires :
            declarations: [
                // Le composant que l'on test
                TodoListPageComponent, 
                // Comme il fera appel dans son template à <app-todo-list>
                // nous avons besoin de déclarer ce composant
                TodoListComponent, 
                // Comme il fera appel dans son template à <app-task-form>
                // nous avons aussi besoin de le déclarer
                TaskFormComponent
            ],
            // Notre composant demande une injection du TasksService
            // il faut donc qu'Angular soit capable de l'instancier
            providers: [TasksService],
            // Enfin, comme on utilise des composants et directives
            // issues d'autres modules, il faut les importer :
            imports: [
                // Notre TasksService s'attend à se faire injecter
                // une instance du HttpClient, il faut donc importer
                // ce module :
                HttpClientModule, 
                // Le TaskFormComponent utilise différentes directives
                // de ce module, qu'on importe donc aussi :
                ReactiveFormsModule, 
                // Certains éléments <a> portent une directive "routerLink"
                // On a donc besoin d'importer le RouterModule, même sans
                // configurer de routes particulières :
                RouterModule.forRoot([])
            ],
        }).compileComponents();

        // Créons la fixture qui permettra de piloter notre composant
        fixture = TestBed.createComponent(TodoListPageComponent);
    });

    // Nous souhaitons nous assurer que le composant appellera bien
    // le TasksService et qu'il affichera les tâches que celui-ci
    // lui renverra
    it('should call TasksService and display returned tasks', () => {
        // Nous pouvons obtenir une instance du TasksService grâce
        // au TestBed
        const service = TestBed.inject(TasksService);

        // Nous souhaitons remplacer la méthode findAll() du service
        // par une fausse fonction (mock function) afin de : 
        // 1. S'assurer qu'on ne spamme pas l'API HTTP pendant nos tests
        // 2. Pouvoir contrôler la valeur de retour  de la méthode 
        // directement depuis nos tests
        //
        // Pour cela, on créé un "spy" (espion), qui va prendre la 
        // place de la véritable méthode :
        const findAllSpy = spyOn(service, "findAll");

        // On peut dire aussi que, lorsqu'elle sera appelée, la méthode 
        // findAll() retournera un Observable qui contiendra un tableau
        // d'une seule tâche, exactement comme si l'API avait répondu
        // ce même tableau
        findAllSpy.and.returnValue(of([
            { id: 1, text: "MOCK_TASK_1", done: false }
        ]));

        // On lance la détection de changements (la première), qui va
        // donc charger le composant et appeler ngOnInit()
        fixture.detectChanges();

        // On s'attend à ce qu'après le chargement (ngOnInit), le 
        // composant ait bien appelé la méthode findAll() qu'on a remplacé
        expect(findAllSpy).toHaveBeenCalled();

        // Et qu'il ait projeté dans le template une tâche sous la 
        // forme d'un <li>, vu que ce que findAll() a renvoyé est un 
        // tableau contenant une tâche
        expect(fixture.debugElement.queryAll(By.css('ul li')).length).toBe(1);
    });

    it('should call TaskService on a checkbox change', () => {
        // On obtient l'instance du TasksService grâce au TestBed
        const service = TestBed.inject(TasksService);

        // On créé un mock pour la fonction findAll() afin de faire
        // apparaître une seule tâche dont l'identifiant est 1
        // et le statut est false :
        const findAllSpy = spyOn(service, "findAll");
        findAllSpy.and.returnValue(of([
            { id: 1, text: "MOCK_TASK_1", done: false }
        ]));

        // On créé un autre mock pour la fonction toggleDone
        const toggleSpy = spyOn(service, "toggleDone");

        // Le résultat de toggleDone ici importe peu, retournons
        // simplement un Observable d'un tableau vide :
        toggleSpy.and.returnValue(of([]));

        // On lance la première détection de changement qui devrait
        // initialiser le composant, faire appel à notre fausse findAll()
        // et projeter le résultat dans le template HTML 
        fixture.detectChanges();

        // On récupère la case à cocher correspondant à la tâche 1
        const checkbox = fixture.debugElement.query(By.css('#item-1'));
        // On déclenche le changement sur la checkbox comme si
        // l'utilisateur avait cliqué dessus
        checkbox.triggerEventHandler('change', {});

        // Et on s'attend à ce que la méthode toggleDone() du TasksService
        // soit appelée avec en premier paramètre l'identifiant de 
        // la tâche (1) et en second paramètre l'inverse de son statut
        // actuel (donc true) :
        expect(toggleSpy).toHaveBeenCalledWith(1, true);
    });
    
});