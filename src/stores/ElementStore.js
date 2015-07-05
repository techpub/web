import CollectionStore from './CollectionStore';
import Actions from '../constants/Actions';
import {Map} from 'immutable';

class ElementStore extends CollectionStore {
  static handlers = {
    setElement: Actions.UPDATE_ELEMENT,
    setList: Actions.UPDATE_ELEMENT_LIST,
    deleteElement: Actions.DELETE_ELEMENT,
    selectElement: Actions.SELECT_ELEMENT
  }

  constructor(context){
    super(context);

    this.selectedElement = null;
  }

  getElement(id){
    return this.get(id);
  }

  setElement(payload){
    this.set(payload.id, payload);
  }

  deleteElement(id){
    this.remove(id);
    // TODO: Remove all child elements
  }

  deleteElementsOfProject(id){
    this.data = this.data.filter(item => item.get('project_id') !== id);
    this.emitChange();
  }

  getElementsOfProject(id){
    return this.data.filter(item => item.get('project_id') === id);
  }

  setList(payload){
    this.data = this.data.withMutations(data => {
      payload.forEach(item => {
        data.set(item.id, Map(item));
      });
    });

    this.emitChange();
  }

  getSelectedElement(){
    return this.selectedElement;
  }

  selectElement(id){
    if (this.selectedElement === id) return;

    this.selectedElement = id;
    this.emitChange();
  }
}

export default ElementStore;
