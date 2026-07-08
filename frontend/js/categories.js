/* ============================================================
   CloudVault DAM — Category Management Logic
   ============================================================ */

let categoriesLocal = [...DAM_DATA.categories];
let categoryModalInstance;

document.addEventListener('DOMContentLoaded', () => {
  damMountLayout('categories', 'Category Management');
  categoryModalInstance = new bootstrap.Modal(document.getElementById('categoryModal'));

  renderCategoryTable(categoriesLocal);

  document.getElementById('categorySearch').addEventListener('input', damDebounce((e) => {
    const q = e.target.value.toLowerCase().trim();
    renderCategoryTable(categoriesLocal.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)));
  }, 200));

  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
  });

  document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
});

function renderCategoryTable(list){
  document.getElementById('categoryCount').textContent = `${list.length} categories`;
  document.getElementById('categoryTableBody').innerHTML = list.map(c => `
    <tr>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="stat-icon bg-tint-blue mb-0" style="width:36px;height:36px;font-size:.95rem;"><i class="bi bi-tag-fill"></i></div>
          <span class="fw-semibold">${c.name}</span>
        </div>
      </td>
      <td class="text-muted-2">${c.description}</td>
      <td><span class="chip chip-info">${c.total} assets</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-outline-secondary btn-icon-sm" title="Edit" onclick="editCategory(${c.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-outline-danger btn-icon-sm" title="Delete" onclick="deleteCategory(${c.id})"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="4" class="text-center text-muted-2 py-4">No categories match your search.</td></tr>`;
}

function editCategory(id){
  const cat = categoriesLocal.find(c => c.id === id);
  if(!cat) return;
  document.getElementById('categoryModalTitle').textContent = 'Edit Category';
  document.getElementById('categoryId').value = cat.id;
  document.getElementById('categoryName').value = cat.name;
  document.getElementById('categoryDescription').value = cat.description;
  categoryModalInstance.show();
}

function deleteCategory(id){
  const cat = categoriesLocal.find(c => c.id === id);
  damConfirm(`Delete "${cat.name}"? Assets in this category will remain but become uncategorized.`, () => {
    categoriesLocal = categoriesLocal.filter(c => c.id !== id);
    renderCategoryTable(categoriesLocal);
    damToast(`"${cat.name}" was deleted.`, 'danger');
  }, {title:'Delete category?'});
}

function saveCategory(){
  const id = document.getElementById('categoryId').value;
  const name = document.getElementById('categoryName').value.trim();
  const description = document.getElementById('categoryDescription').value.trim();

  if(!name || !description){
    damToast('Please fill in all fields.', 'danger', 'Missing information');
    return;
  }

  if(id){
    const cat = categoriesLocal.find(c => c.id === parseInt(id,10));
    cat.name = name; cat.description = description;
    damToast('Category updated successfully.', 'success');
  } else {
    categoriesLocal.push({id: Date.now(), name, description, total: 0});
    damToast('Category created successfully.', 'success');
  }
  renderCategoryTable(categoriesLocal);
  categoryModalInstance.hide();
}
