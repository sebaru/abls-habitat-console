<div class="container-fluid">

 <div class="row m-2">
   <div class="col-auto"><h3><img src="https://static.abls-habitat.fr/img/audio.png" style="width:80px" alt="Configuration Audio">Connecteurs AUDIO</h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="AUDIO_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une connexion</button>
        <button type="button" onclick="AUDIO_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>
 </div>

<hr>

   <div class="table-responsive">
     <table id="idTableAUDIO" class="table table-striped table-bordered table-hover">
       <thead class="table-dark">
       </thead>
       <tbody>
       </tbody>
     </table>
   </div>

<!-- Container -->
</div>


<div id="idAUDIOEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idAUDIOTitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Choix de l'agent</label>
           <select id="idTargetAgent" class="custom-select border-info"></select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Tech_ID</label>
           <input id="idAUDIOTechID" type="text" class="form-control" maxlength="32" placeholder="Tech_ID du thread AUDIO">
          </div>
       </div>

       <div class="col ">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Language</label>
           <input id="idAUDIOLanguage" type="text" class="form-control" placeholder="fr for french">
          </div>
       </div>

       <div class="col ">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Device</label>
           <input id="idAUDIODevice" type="text" class="form-control" placeholder="default device">
          </div>
       </div>

       <div class="col ">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idAUDIODescription" type="text" class="form-control" placeholder="Description de la zone de diffusion">
          </div>
       </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idAUDIOValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/audio.js" type="text/javascript"></script>
