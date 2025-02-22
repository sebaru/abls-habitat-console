<div class="container-fluid">

 <div class="row m-2">
   <h3><i class="fas fa-code text-primary"></i> Edition du package D.L.S <strong id="idSourceTitle"></strong></h3>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="Dls_Pkg_Save()" class="btn btn-success"><i class="fas fa-save"></i> Sauver</button>
        <button type="button" onclick="Dls_Pkg_Compil()" class="btn btn-outline-success"><i class="fas fa-coffee"></i> Compiler Tout</button>
        <button type="button" onclick=Redirect("/dls/packages") class="btn btn-secondary"><i class="fas fa-list"></i> Liste Packages</button>
         <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
 </div>

<hr>

     <div class="row m-1">
       <div class="col-12 border border-warning">
         <textarea id="idSourceCode" rows="10"></textarea>
       </div>
     </div>

<!-- Container -->
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js" type="text/javascript"></script>
<script src="/js/dls_package.js" type="text/javascript"></script>
