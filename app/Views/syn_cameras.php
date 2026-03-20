<div class="container">

 <div class="row m-2">
   <div class="col-auto"><h3><i class="fas fa-video text-primary"></i> Cameras par synoptique</h3></div>

   <div class ="col-auto ms-auto btn-group">
        <button type="button" onclick="SYN_CAMERA_New()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter</button>
   </div>
 </div>

<hr>

<div class="table-responsive">
  <table id="idTableSYNCameras" class="table table-striped table-bordered table-hover">
    <thead class="table-dark">
    </thead>
    <tbody>
    </tbody>
  </table>
</div>

<!-- Container -->
</div>

<div id="idSYNCameraEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idSYNCameraEditTitre"></span></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Synoptique parent</label>
           <select id="idSYNCameraEditPage" class="col-7 col-sm-8 custom-select border-info"></select>
          </div>
       </div>

       <div class="col ">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-right">Caméra</label>
           <select id="idSYNCameraEditCamera" class="col-7 col-sm-8 custom-select border-info"></select>
          </div>
       </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idSYNCameraEditValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>


<script src="/js/syn_cameras.js" type="text/javascript"></script>
