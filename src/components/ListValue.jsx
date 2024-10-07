import React, { useEffect, useState } from "react";
import "./listvalue.css";
import config from "../config";

const ListValue = () => {
  const [values, setValues] = useState([]);
  const [sum, setSum] = useState(0);
  const [latestValue, setLatestValue] = useState(0);
  const baseUrl = config.apiUrlBase;

  const getValues = async () => {
    const response = await fetch(`${baseUrl}/api/values`);
    const data = await response.json();
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setValues(data);
    // Calculate sum
    const total = data.reduce((acc, item) => acc + item.pulse, 0);
    setSum(total);

    if (data.length > 0) {
      const lastValue = data[0].pulse;
      const transformedValue = (lastValue * 3600) / (3200 * 60);
      setLatestValue(transformedValue);
    }
  };

  useEffect(() => {
    getValues();
  }, []);

  // Calculate the result of sum/3200
  const result = sum / 3200;

  // Function to delete all values
  const deleteAllValues = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/delete`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        console.log("All values are deleted");
        getValues();
      }
      // After deletion, fetch updated values
    } catch (error) {
      console.error("Error deleting values:", error);
    }
  };

  const toMoscowTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="container">
      <div className="fixed-section bg-white w-75">
        <h2 className="text-center">ТЕХ-УЧЕТ</h2>
        <button className="btn btn-danger mb-4" onClick={deleteAllValues}>
          Очистить
        </button>
        <table className="table table-bordered border-secondary text-center">
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "50%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="fs-4">Предаточное число счетчика</td>
              <td className="fs-4">3200 imp-kW·h</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <table className="table table-bordered border-secondary text-center">
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "50%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="fs-4">Общая мощность</td>
              <td className="fs-4">
                {latestValue !== null ? latestValue.toFixed(4) : 0} kW·h
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div>
          <table className="table table-bordered border-secondary text-center">
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Сумма импульсов</th>
                <th>Мощность потребления</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{sum}</td>
                <td>{result.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
          <table className="table table-bordered border-secondary text-center">
            <colgroup>
              <col style={{ width: "33%" }} />
              <col style={{ width: "33%" }} />
              <col style={{ width: "33%" }} />
            </colgroup>
            <thead>
              <tr>
                <th colSpan={3} className="text-center">
                  Входящий импульс за 1 минут
                </th>
              </tr>
              <tr>
                <th>Дата и время</th>
                <th>Имеи</th>
                <th>Значение</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <div className="table-wrapper mx-auto w-100 mt-5">
        <div className="scrollable-content">
          <table className="table-scrollable table table-bordered border-secondary text-center">
            <colgroup>
              <col style={{ width: "33%" }} />
              <col style={{ width: "33%" }} />
              <col style={{ width: "33%" }} />
            </colgroup>
            <tbody>
              {values.map((item) => (
                <tr key={item.meter_id}>
                  <td>{toMoscowTime(item.date)}</td>
                  <td>{item.imei}</td>
                  <td>{item.pulse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListValue;
