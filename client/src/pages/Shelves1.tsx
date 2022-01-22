import { Grid, Container } from '@mui/material';
import ActionBar from 'src/components/ActionBar/ActionBar';
import ShelvesGrid from 'src/components/DataGrid/ShelvesGrid';
import { Shelf } from 'src/interface/shelves';
import NewShelfDialog from 'src/components/Dialog/NewShelfDialog';
import { useEffect, useState } from 'react';

import {
  addShelfAPI,
  deleteBookAPI,
  deleteShelfAPI,
  getLibrariesAPI,
  getShelvesAPI,
  updateShelfAPI
} from 'src/services/api';
import { Library } from 'src/interface/libraries';
import { useNotification } from 'src/contexts/Notification';
import { OperationEnum, PaddingBox } from './Libraries';
import DeleteConfirmationDialog from 'src/components/Dialog/DeleteConfirmationDialog';
import BooksGrid from 'src/components/DataGrid/BooksGrid';
import { Helmet } from 'react-helmet-async';
import { getShelvesFromLibrary } from 'src/utils/book';

const Shelves = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShelvesLoading, setShelvesLoading] = useState(false);
  const [shelvesList, setShelvesList] = useState<Shelf[]>([]);
  const [librariesList, setLibrariesList] = useState<Library[]>([]);
  const [librarySelected, setLibrarySelected] = useState<Library>();
  const [shelfSelected, setShelfSelected] = useState<Shelf>();
  const notify = useNotification();

  useEffect(() => {
    fetchLibraries();
  }, []);

  useEffect(() => {
    if (librarySelected) {
      getShelves(librarySelected._id);
    }
  }, [librarySelected]);

  const fetchLibraries = () => {
    getLibrariesAPI()
      .then((response) => {
        setLibrariesList(response.data);
      })
      .catch((error) => {
        notify.showNotification(error.message, 'error');
      });
  };
  /**
   * This method allow retrieving of shelves based on library ID
   */

  const getShelves = (libraryId: string) => {
    setShelvesLoading(true);
    const libraries = getShelvesFromLibrary(librariesList, libraryId);
    setShelvesList(libraries.shelves);
    setShelvesLoading(false);

    // getShelvesAPI(libraryId)
    //   .then((response) => {
    //     const shelves = response.data;

    //     if (shelfSelected) {
    //       const newShelfSelected = shelves.find(
    //         (shelf: Shelf) => shelfSelected._id === shelf._id
    //       );
    //       setShelvesList(shelves);
    //       setShelfSelected(newShelfSelected);
    //     } else {
    //       setShelvesList(shelves);
    //     }
    //   })
    //   .catch((error) => {
    //     notify.showNotification(error.message, 'error');
    //   })
    //   .finally(() => {
    //     setShelvesLoading(false);
    //   });
  };

  const handleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const handleActionDialog = () => {
    setShelfSelected(null);
    handleDialog();
  };

  /**
   *
   * This method will call the API for adding shelf on library
   * @param newLibrary
   */
  const onSaveNewShelf = (newLibrary: string) => {
    addShelfAPI(newLibrary, librarySelected?._id)
      .then((response) => {
        notify.showNotification(
          `Shelf ${response.data.name} has been added`,
          'success'
        );
        getShelvesFromLibrary(librariesList, librarySelected?._id);
      })
      .catch((error) => {
        notify.showNotification(error.message, 'error');
      })
      .finally(() => {
        handleDialog();
      });
  };

  const onUpdateShelf = (shelfName: string) => {
    const updatedShelf = {
      ...shelfSelected,
      name: shelfName
    };
    updateShelfAPI(librarySelected?._id, updatedShelf)
      .then(() => {
        notify.showNotification(
          `Shelf ${shelfName} has been updated`,
          'success'
        );
        //@ts-ignore
        getShelvesFromLibrary(librariesList, librarySelected?._id);
      })
      .catch((error) => {
        notify.showNotification(error.message, 'error');
      })
      .finally(() => {
        handleDialog();
      });
  };

  /**
   * Call the api responsible for delete shelf from a library
   */
  const onDeleteShelf = () => {
    //@ts-ignore
    deleteShelfAPI(librarySelected._id, shelfSelected._id)
      .then(() => {
        notify.showNotification(
          `Shelf '${shelfSelected.name} has been deleted'`,
          'success'
        );
        getShelvesFromLibrary(librariesList, librarySelected._id);
      })
      .catch((error) => {
        notify.showNotification(error.message, 'error');
      })
      .finally(() => {
        handleDeleteDialog();
      });
  };

  const onCloseDialog = () => {
    handleDialog();
  };
  /**
   * This method allow to select library from Table
   * @param library
   */
  const onLibrarySelected = (library: Library) => {
    setLibrarySelected(library);
  };

  const onShelfSelected = (shelf: Shelf) => {
    setShelfSelected(shelf);
  };

  const onDeleteBook = (bookId: number) => {
    deleteBookAPI(bookId)
      .then(() => {
        notify.showNotification('Book has been deleted', 'success');
        //getShelvesFromLibrary(librariesList, librarySelected._id);
      })
      .catch((error) => {
        notify.showNotification('Something went wrong', 'error');
      });
  };

  const handleDeleteDialog = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  const onOpenFromDialog = (operationType: OperationEnum) => {
    switch (operationType) {
      case OperationEnum.DELETE:
        handleDeleteDialog();
        break;
      case OperationEnum.UPDATE:
        handleDialog();
        break;
    }
  };

  const onUpdateBook = () => {
    getShelvesFromLibrary(librariesList, librarySelected._id);
  };
  return (
    <>
      <Helmet>
        <title> Shelves</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <PaddingBox>
              <ActionBar
                leftTitle="Shelves"
                leftSubtitle="This page allow you handling of shelf present in your library"
                rightText={`Create shelf ${
                  librarySelected ? 'for ' + librarySelected.name : ''
                }`}
                onActionButtonClick={handleActionDialog}
                isButtonDisabled={!librarySelected}
              ></ActionBar>
            </PaddingBox>
          </Grid>
          <Grid item xs={12}>
            {/* <ShelvesGrid
              isShelvesLoading={isShelvesLoading}
              shelvesList={shelvesList}
              // onLibrarySelected={onLibrarySelected}
              librariesList={librariesList}
              librarySelected={librarySelected}
              shelfSelected={shelfSelected}
              onShelfSelected={onShelfSelected}
              onOpenFromDialog={onOpenFromDialog}
            ></ShelvesGrid> */}
          </Grid>
          {shelfSelected && (
            <Grid item xs={12}>
              <BooksGrid
                booksRows={shelfSelected.books}
                onDeleteBookAction={onDeleteBook}
                title={`Books List (${shelfSelected.name})`}
                onUpdateBookAction={onUpdateBook}
              />
            </Grid>
          )}
        </Grid>
      </Container>

      {isDialogOpen && (
        <NewShelfDialog
          isDialogOpen={isDialogOpen}
          onSave={shelfSelected ? onUpdateShelf : onSaveNewShelf}
          onClose={onCloseDialog}
          isUpdate={shelfSelected !== null}
          shelfNameToUpdate={shelfSelected ? shelfSelected.name : ''}
        ></NewShelfDialog>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialog}
        onConfirm={onDeleteShelf}
        description={`If you choose to delete  you will lose all your data stored on it`}
        title="Do you want delete this Shelf?"
      ></DeleteConfirmationDialog>
    </>
  );
};

export default Shelves;
