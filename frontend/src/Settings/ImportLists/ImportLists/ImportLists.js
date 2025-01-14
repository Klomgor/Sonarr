import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import AddImportListModal from './AddImportListModal';
import EditImportListModalConnector from './EditImportListModalConnector';
import ImportList from './ImportList';
import styles from './ImportLists.css';

class ImportLists extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isAddImportListModalOpen: false,
      isEditImportListModalOpen: false
    };
  }

  //
  // Listeners

  onAddImportListPress = () => {
    this.setState({ isAddImportListModalOpen: true });
  };

  onAddImportListModalClose = ({ listSelected = false } = {}) => {
    this.setState({
      isAddImportListModalOpen: false,
      isEditImportListModalOpen: listSelected
    });
  };

  onEditImportListModalClose = () => {
    this.setState({ isEditImportListModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      items,
      tagList,
      onConfirmDeleteImportList,
      ...otherProps
    } = this.props;

    const {
      isAddImportListModalOpen,
      isEditImportListModalOpen
    } = this.state;

    return (
      <FieldSet legend={translate('ImportLists')} >
        <PageSectionContent
          errorMessage={translate('ImportListsLoadError')}
          {...otherProps}
        >
          <div className={styles.lists}>
            {
              items.map((item) => {
                return (
                  <ImportList
                    key={item.id}
                    {...item}
                    tagList={tagList}
                    onConfirmDeleteImportList={onConfirmDeleteImportList}
                  />
                );
              })
            }

            <Card
              className={styles.addList}
              onPress={this.onAddImportListPress}
            >
              <div className={styles.center}>
                <Icon
                  name={icons.ADD}
                  size={45}
                />
              </div>
            </Card>
          </div>

          <AddImportListModal
            isOpen={isAddImportListModalOpen}
            onModalClose={this.onAddImportListModalClose}
          />

          <EditImportListModalConnector
            isOpen={isEditImportListModalOpen}
            onModalClose={this.onEditImportListModalClose}
          />
        </PageSectionContent>
      </FieldSet>
    );
  }
}

ImportLists.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  tagList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onConfirmDeleteImportList: PropTypes.func.isRequired
};

export default ImportLists;
