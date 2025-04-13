<div class="container-fluid">

 <div class="row m-2">
   <div class="col-auto"><h3><img src="https://static.abls-habitat.fr/img/shelly.jpg" style="width:80px" alt="Shelly">Liste des Modules Shelly</h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="SHELLY_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter un module</button>
        <button type="button" onclick="SHELLY_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>
 </div>

<hr>

   <div class="table-responsive">
    <table id="idTableSHELLY" class="table table-striped table-bordered table-hover">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
   </div>

<!---------------------------------------------------- Modal Edit Shelly ------------------------------------------------------>

<div id="idSHELLYEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idSHELLYTitre"></span></h5>
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
           <input id="idSHELLYTechID" required type="text" class="form-control" placeholder="Tech ID du module">
          </div>
        </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idSHELLYDescription" type="text" class="form-control" placeholder="Ou est le module ?">
          </div>
        </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Hostname</label>
           <input id="idSHELLYHostname" required type="text" class="form-control" placeholder="@IP ou hostname">
          </div>
        </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">ID</label>
           <input id="idSHELLYStringID" required type="text" class="form-control" placeholder="ID du module">
          </div>
        </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idSHELLYValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/shelly.js" type="text/javascript"></script>
