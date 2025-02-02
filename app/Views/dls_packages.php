<div class="container">

 <div class="row m-2">
   <div class="col-auto"><h3><i class="fas fa-code text-secondary"></i> Liste des Packages D.L.S</h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="Show_Modal_Dls_Pkg_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter un Package</button>
         <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
 </div>

<hr>

   <div class="table-responsive">
    <table id="idTableDLSPkg" class="table table-striped table-bordered table-hover">
      <thead class="table-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
   </div>

<!-- Container -->
</div>

<div id="idModalDlsPkgEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idModalDlsPkgEditTitre"></span></h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-center">Synoptique du module</label>
            <input id="idModalDlsPkgEditName" type="text" class="form-control" maxlength="32" placeholder="Nom du package">
          </div>
       </div>

       <div class="col">
          <div class="input-group mb-1">
           <label class="col-5 col-sm-4 col-form-label text-center">TechID du module</label>
            <input id="idModalDlsPkgEditDescription" type="text" class="form-control" maxlength="128" placeholder="Description du package">
           </div>
       </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idModalDlsPkgEditValider" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/dls_packages.js" type="text/javascript"></script>
