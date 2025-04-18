<div class="container-fluid">

 <div class="row m-2">
   <div class="col-auto"><h3><img src="https://static.abls-habitat.fr//img/meteo.svg" style="width:80px" alt="Récupération Météo">Configuration de la météo</h3></div>

   <div class="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="METEO_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une connexion</button>
        <button type="button" onclick="METEO_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
        <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
 </div>

<hr>

   <div class="table-responsive">
     <table id="idTableMETEO" class="table table-striped table-bordered table-hover">
       <thead class="table-dark">
       </thead>
       <tbody>
       </tbody>
     </table>
   </div>

<!-- Container -->
</div>

<div id="idMETEOEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMETEOTitre"></span></h5>
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
           <label class="col-5 col-sm-4 col-form-label text-right">Tech_ID</label>
           <input id="idMETEOTechID" type="text" class="form-control" maxlength="32" placeholder="Tech_ID du Thread METEO">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Token API</label>
           <input id="idMETEOToken" type="text" class="form-control" placeholder="Token API METEO Concept">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Code Insee Commune</label>
           <input id="idMETEOCodeInsee" type="text" class="form-control" placeholder="Code Insee de la commune">
           <a target="_blank" href="https://api.meteo-concept.com/login" class="col-3 col-sm-2 col-form-label">Creer un token</a>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idMETEODescription" type="text" class="form-control" placeholder="Description de la source">
          </div>
       </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMETEOValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/meteo.js" type="text/javascript"></script>
