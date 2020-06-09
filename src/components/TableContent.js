import React from 'react';
import {
  Badge, Button, Input, Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
// import moment from 'moment';
// import { calcTime } from '../utils/dateHelper';
import { TABLE_TYPE } from '../utils/constants';
// import OrderContanier from './OrderContainer';

function TableContent({
  headers, content, onClick, rowIsActive, maxRank,
}) {
  const itemForCellWith = (header, item, index) => {
    // const onhold = item.onhold ? item.onhold : false;


    switch (header.type) {
      // case TABLE_TYPE.date: {
      //   const date = moment(item[header.value].toDate()).format('MMM Do YY');
      //   return <td key={index}>{date}</td>;
      // }
      // case TABLE_TYPE.dateUtc: {
      //   if (onhold && header.value === 'start_date') return <td key={index}>No Date</td>;

      //   const dateUtc = moment(
      //     calcTime(item[header.value].toDate(), item.utcOffset),
      //   ).format('MMM Do YY');
      //   return <td key={index}>{dateUtc}</td>;
      // }
      case TABLE_TYPE.detailButton: {
        return (
          <td key={index}>
            <Button onClick={() => onClick(item)}>
              <i className="icon-arrow-right" />
            </Button>
          </td>
        );
      }
      case TABLE_TYPE.uploadButton: {
        return (
          <td key={index}>
            <Button onClick={() => onClick(item, true)}>
              <i className="icon-arrow-right" />
            </Button>
          </td>
        );
      }
      case TABLE_TYPE.checker: {
        let checkValue = false;
        if (
          header.value === 'extra_fee_status'
          && (item.extra_fee_status || item.has_extra_fee)
        ) {
          checkValue = true;
        }
        if (header.value === 'has_extra_photos' && item.has_extra_photos) {
          checkValue = true;
        }
        return (
          <td key={index} className="text-center">
            <Input type="checkbox" readOnly checked={checkValue} addon />
          </td>
        );
      }
      case TABLE_TYPE.revokeButton: {
        return (
          <td key={index}>
            <Button
              color="danger"
              onClick={() => onClick(item, 'revoke_action')}
            >
              Revoke
            </Button>
          </td>
        );
      }
      case TABLE_TYPE.assignButton: {
        return (
          <td key={index}>
            <Button
              color="primary"
              onClick={() => onClick(item, 'assign_action')}
            >
              Assign Roles
            </Button>
          </td>
        );
      }
      case TABLE_TYPE.image: {
        return (
          <td key={index}>
            {item[header.value] ? (
              <img width="100px" src={item[header.value]} alt="" />
            ) : (
                ''
              )}
          </td>
        );
      }
      case TABLE_TYPE.fullImage: {
        return (
          <td key={index}>
            {item[header.value] ? (
              <img width="100px" src={item[header.value].fullImage} alt="" />
            ) : (
                ''
              )}
          </td>
        );
      }
      case TABLE_TYPE.url: {
        return (
          <td key={index}>
            <a
              width="100px"
              href={item[header.value]}
              alt="s"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here!
            </a>
          </td>
        );
      }
      case TABLE_TYPE.status: {
        return (
          <td key={index}>
            <Badge
              color={item[header.value] === 'active' ? 'success' : 'secondary'}
            >
              {item[header.value]}
            </Badge>
          </td>
        );
      }
      // case TABLE_TYPE.orderButton: {
      //   return (
      //     <td key={index}>
      //       <OrderContanier
      //         maxRank={maxRank}
      //         onSet={(value) => onClick(item, 'order_action', value)}
      //       />
      //     </td>
      //   );
      // }
      case TABLE_TYPE.deleteButton: {
        return (
          <td key={index}>
            <Button
              color="danger"
              onClick={() => onClick(item, 'delete_action')}
            >
              Delete
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
