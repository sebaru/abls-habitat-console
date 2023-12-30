<div class="container-fluid">

 <div class="row m-2">
   <div class="col-auto"><h3><img src="https://static.abls-habitat.fr/img/wago_750342.webp" style="width:80px" alt="Wago 750-342">Liste des Modules WAGO sur Modbus</h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="MODBUS_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter un module</button>
        <button type="button" onclick="MODBUS_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>
 </div>

<hr>

   <div class="table-responsive">
    <table id="idTableMODBUS" class="table table-striped table-bordered table-hover">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
   </div>

<hr>

<div class="col-auto"><h3><img src="https://static.abls-habitat.fr/img/wago_750342.webp" style="width:80px" alt="Wago 750-342">Configuration des I/O WAGO</h3></div>

<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#idTabEntreeTor">
        <img style="width: 30px" data-bs-toggle="tooltip" title="Entrées TOR" src="https://static.abls-habitat.fr/img/entree.png" />Entrées TOR</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#idTabEntreeAna">
        <img style="width: 30px" data-bs-toggle="tooltip" title="Entrées ANA" src="https://static.abls-habitat.fr/img/entree_analogique.png" />Entrées ANA</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#idTabSortieTor">
        <img style="width: 30px" data-bs-toggle="tooltip" title="Sorties TOR" src="https://static.abls-habitat.fr/img/sortie.png" />Sorties TOR</a></li>
  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#idTabSortieAna">
        <img style="width: 30px" data-bs-toggle="tooltip" title="Sorties ANA" src="https://static.abls-habitat.fr/img/sortie_analogique.png" />Sorties ANA</a></li>
</ul>

<div class="tab-content">

<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabEntreeTor" class="tab-pane fade in table-responsive mt-1 show active" role="tabpanel">

    <table id="idTableMODBUS_DI" class="table table-striped table-bordered table-hover w-100">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
</div>

<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabSortieTor" class="tab-pane fade in table-responsive mt-1" role="tabpanel">

    <table id="idTableMODBUS_DO" class="table table-striped table-bordered table-hover w-100">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
</div>
<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabEntreeAna" class="tab-pane fade in table-responsive mt-1" role="tabpanel">

    <table id="idTableMODBUS_AI" class="table table-striped table-bordered table-hover w-100">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
</div>
<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabSortieAna" class="tab-pane fade in table-responsive mt-1" role="tabpanel">

    <table id="idTableMODBUS_AO" class="table table-striped table-bordered table-hover w-100">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
</div>

</div> <!-- TabContent -->
<!-- Container -->
</div>

<!------------------------------------------------- Modal Edit Digital Input -------------------------------------------------->
<div id="idMODBUSEditDI" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMODBUSEditDITitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Flip</label>
						     <select id="idMODBUSEditDIFlip" class="col-7 col-sm-8 custom-select border-info">
             <option value="0">Non - logique normale</option>
             <option value="1">Oui - logique inversée</option>
           </select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idMODBUSEditDILibelle" type="text" class="form-control" placeholder="Description">
          </div>
       </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMODBUSEditDIValider" type="button" class="btn btn-primary"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<!------------------------------------------------- Modal Edit Digital utput -------------------------------------------------->
<div id="idMODBUSEditDO" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMODBUSEditDOTitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idMODBUSEditDOLibelle" type="text" class="form-control" placeholder="Description">
          </div>
       </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMODBUSEditDOValider" type="button" class="btn btn-primary"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<!------------------------------------------------- Modal Edit Analog Input --------------------------------------------------->
<div id="idMODBUSEditAI" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMODBUSEditAITitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Type de borne</label>
           <select id="idMODBUSEditAITypeBorne" class="custom-select border-info">
           </select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Archivage</label>
           <select id="idMODBUSEditAIArchivage" class="custom-select border-info">
           </select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Minimum</label>
           <input id="idMODBUSEditAIMin" type="number" class="form-control" placeholder="Valeur Min">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Maximum</label>
           <input id="idMODBUSEditAIMax" type="number" class="form-control" placeholder="Valeur Max">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Unité</label>
           <input id="idMODBUSEditAIUnite" type="text" class="form-control" placeholder="°C, km/h, ...">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idMODBUSEditAILibelle" type="text" class="form-control" placeholder="Description">
          </div>
       </div>

      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMODBUSEditAIValider" type="button" class="btn btn-primary"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>
<!------------------------------------------------- Modal Edit Analog Output -------------------------------------------------->
<div id="idMODBUSEditAO" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMODBUSEditAOTitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Type de borne</label>
           <select id="idMODBUSEditAOTypeBorne" class="custom-select border-info">
           </select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Archivage</label>
           <select id="idMODBUSEditAOArchivage" class="custom-select border-info">
           </select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Minimum</label>
           <input id="idMODBUSEditAOMin" type="number" class="form-control" placeholder="Valeur Min">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Maximum</label>
           <input id="idMODBUSEditAOMax" type="number" class="form-control" placeholder="Valeur Max">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Unité</label>
           <input id="idMODBUSEditAOUnite" type="text" class="form-control" placeholder="°C, km/h, ...">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idMODBUSEditAOLibelle" type="text" class="form-control" placeholder="Description">
          </div>
       </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMODBUSEditAOValider" type="button" class="btn btn-primary"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<!---------------------------------------------------- Modal Edit Modbus ------------------------------------------------------>

<div id="idMODBUSEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMODBUSTitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Choix de l'agent</label>
           <select id="idTargetAgent" class="custom-select border-info"></select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">TechID</label>
           <input id="idMODBUSTechID" required type="text" class="form-control" placeholder="Tech ID du module">
          </div>
        </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idMODBUSDescription" type="text" class="form-control" placeholder="Ou est le module ?">
          </div>
        </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Hostname</label>
           <input id="idMODBUSHostname" required type="text" class="form-control" placeholder="@IP ou hostname">
          </div>
        </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Watchdog</label>
           <input id="idMODBUSWatchdog" type="number" class="form-control" min=10 max=1200 placeholder="Nombre de 1/10 de secondes avant de couper les sorties">
           <span class="input-group-text">1/10 secondes</span>
          </div>
        </div>

       <div class="col ">
          <div class="input-group align-items-center ">
           <label class="col-5 col-sm-4 col-form-label text-right">Max Requetes/sec</label>
           <input id="idMODBUSMaxRequestParSec" type="number" class="form-control" min=1 max=100 placeholder="Nombre de requetes max par seconde">
            <span class="input-group-text form-control">par seconde</span>
          </div>
        </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMODBUSValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/modbus.js" type="text/javascript"></script>
