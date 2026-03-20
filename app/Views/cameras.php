<div class="container-fluid">

 <div class="row m-2">
   <div class="col-auto"><h3><i class="fas fa-video text-primary"></i> Gestion des caméras</h3></div>

   <div class ="col-auto ms-auto btn-group">
        <button type="button" onclick="CAMERA_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une caméra</button>
        <button type="button" onclick="CAMERA_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>
 </div>

<hr>

   <div class="table-responsive">
     <table id="idTableCAMERAS" class="table table-striped table-bordered table-hover">
       <thead class="table-dark">
       </thead>
       <tbody>
       </tbody>
     </table>
   </div>

<!-- Container -->
</div>


<div id="idCAMERAEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-video"></i> <span id="idCAMERATitre"></span></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Nom</label>
           <input id="idCAMERANom" type="text" class="form-control" placeholder="Nom de la caméra">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">URL</label>
           <input id="idCAMERAUrl" type="text" class="form-control" placeholder="URL du flux vidéo">
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Niveau d'accès</label>
           <select id="idCAMERAAccessLevel" class="custom-select"></select>
          </div>
       </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idCAMERAValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/cameras.js" type="text/javascript"></script>
