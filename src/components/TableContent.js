import React from 'react';
import {
  Badge, Button, Input, Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { TABLE_TYPE } from '../utils/constants';

function TableContent({
  headers, content, onClick, rowIsActive, maxRank,
}) {
  const itemForCellWith = (header, item, index) => {


    switch (header.type) {
      case TABLE_TYPE.detailButton: {
        return (
          <td key={index}>
            <Button onClick={() => onClick(item)}>
              <i className="icon-arrow-right" />
            </Button>
          </td>
        );
      }
      case TABLE_TYPE.checker: {
        let checkValue = false;
        if (header.value === 'linked' && item.linked) {
          checkValue = true;
        }
        return (
          <td key={index} className="text-center">
            <Input type="checkbox" readOnly checked={checkValue} addon />
          </td>
        );
      }
      case TABLE_TYPE.image: {
        return (
          <td key={index}>
            {item[header.value] ? (
              <img className="rounded-circle" width="50px" height="50px" src={item[header.value]} alt="" />
            ) : (
                ''
              )}
          </td>
        );
      }
      case TABLE_TYPE.status: {
        return (
          <td key={index}>
            <Badge
              color={item[header.value] === 'User deleted' ? 'danger' : 'secondary'}
            >
              {item[header.value]}
            </Badge>
          </td>
        );
      }
      case TABLE_TYPE.addButton: {
        return (
          <td key={index}>
            <Button
              color="primary"
              onClick={() => onClick(item, 'add_action')}
            >
              Add Contact
            </Button>
          </td>
        );
      }

      case TABLE_TYPE.blockButton: {
        return (
          <td key={index}>
            <Button
              color="warning"
              onClick={() => onClick(item, 'block_action')}
            >
              Block User
            </Button>
          </td>
        );
      }

      case TABLE_TYPE.unblockButton: {
        return (
          <td key={index}>
            <Button
              color="primary"
              onClick={() => onClick(item, 'unblock_action')}
            >
              Unblock User
            </Button>
          </td>
        );
      }

      default: {
        return <td key={index}>{item[header.value]}</td>;
      }
    }
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          {headers.map((header) => (
            <th scope="col" key={header.label}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((item) => (
          <tr className={item[rowIsActive] ? 'active' : ''} key={item.id}>
            {headers.map((header, index) => itemForCellWith(header, item, index))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
TableContent.propTypes = {
  headers: PropTypes.shape.isRequired,
  content: PropTypes.shape.isRequired,
  onClick: PropTypes.func.isRequired,
  // rowIsActive: PropTypes.string.isRequired,
  // maxRank: PropTypes.number,

};

export default TableContent;
