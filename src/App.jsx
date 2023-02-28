import "./App.css";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { CiPlay1 } from "react-icons/ci";
import { v4 as uuid } from "uuid";

function App() {
  const unique_id = uuid();
  const small_id = unique_id.slice(0, 8);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [newData, setNewData] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [totalSecond, setTotalSecond] = useState(0);
  const [totalMinute, setTotalMinute] = useState(0);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [showId, setShowId] = useState("");

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
        setDate1(new Date());
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running]);

  const handleData = () => {
    const data = {
      id: small_id,
      title: title,
      second: Math.floor((time / 1000) % 60),
      minute: Math.floor((time / 60000) % 60),
      count: 1,
      startHour: date1.getHours(),
      startMinute: date1.getMinutes(),
      endHour: date2.getHours(),
      endMinute: date2.getMinutes(),
      show: false,
    };
    setTotalSecond((time) => time + data?.second);
    setTotalMinute((time) => time + data?.minute);

    let all = [];
    const findItem = newData?.find((item) => item?.id === id);

    console.log(findItem, id);

    if (id && findItem) {
      all = newData?.map((item) => {
        if (item?.id === id) {
          console.log([...item?.old, data]);
          return {
            ...item,
            old: [
              ...item?.old,
              data,
              // {
              //   id: small_id,
              //   title: item?.title,
              //   second: item?.second,
              //   minute: item?.minute,
              //   count: item?.count,
              //   old: [],
              //   startHour: item?.startHour,
              //   startMinute: item?.startMinute,
              //   endHour: item?.endHour,
              //   endMinute: item?.endMinute,
              // },
            ],

            title: title,
            second: data?.second + item?.second,
            minute: data?.minute + item?.minute,
            count: item?.count + 1,
            startHour: date1.getHours(),
            startMinute: date1.getMinutes(),
            endHour: date2.getHours(),
            endMinute: date2.getMinutes(),
            show: data?.show,
          };
        } else return item;
      });
    } else {
      all = [
        ...newData,
        {
          ...data,
          title: title,
          second: data?.second,
          minute: data?.minute,
          startHour: data?.startHour,
          startMinute: data?.startMinute,
          endHour: data?.endHour,
          endMinute: data?.endMinute,
          show: data?.show,
          old: [data],
        },
      ];
    }
    setId(null);
    setNewData(all);

    setRunning(false);
    setTime(0);
    setTitle("");
    setDate2(new Date());
  };

  const showModal = () => {
    setIsModalOpen(true);
    setRunning(false);
  };

  const handleOk = () => {
    setTime(0);
    setRunning(false);
    setIsModalOpen(false);
    setTitle("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRunning(true);
  };

  const showModal2 = (e) => {
    setId(e.currentTarget.id);
    setIsModalOpen2(true);
  };

  const handleOk2 = () => {
    setNewData((prev) => prev.filter((item) => item?.id !== id));

    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
    setId(null);
  };

  const handleCheck = () => {
    if (title !== "") {
      setRunning(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title !== "") {
      setRunning(true);
    }
  };

  const handleEdit = (e) => {
    setId(e.currentTarget.id);
    setTitle(e.currentTarget.name);

    setRunning(true);
  };

  const handleOldData = (e) => {
    const id = e.currentTarget.id;
    if (id === showId) {
      setShowId("");
    } else {
      setShowId(id);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="heading">
          <div className="formAction">
            <div className="formItems">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="input"
                  placeholder="Writh The Title"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete={false}
                />
              </form>

              <div className="timeAction">
                <div>
                  <span>
                    {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                  </span>
                  <span>
                    {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                  </span>
                  <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                </div>

                {running ? (
                  <div className="flex">
                    <button className="button" onClick={handleData}>
                      Stop
                    </button>
                    <button onClick={showModal} className="btn">
                      X
                    </button>
                  </div>
                ) : (
                  <button className="button" onClick={handleCheck}>
                    Start
                  </button>
                )}
                <Modal
                  title="Stop"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p>Do You Discard It....?</p>
                </Modal>
                <Modal
                  title="Delete"
                  open={isModalOpen2}
                  onOk={handleOk2}
                  onCancel={handleCancel2}
                >
                  <p>Do You Delete It....?</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>

        <div className="bodyFlot">
          <div className="timeWeek">
            <h3>This Day</h3>
            <span>
              Total: {`${totalMinute}`.padStart(2, "0")} :
              {`${totalSecond}`.padStart(2, "0")}
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <td>Tody</td>
              </tr>
            </thead>
            <tbody>
              {newData.map((item) => (
                <>
                  <tr key={item?.id}>
                    <td className="clent">
                      {item?.count !== 1 ? (
                        <span
                          id={item?.id}
                          onClick={handleOldData}
                          className="table-count"
                        >
                          {item?.count}
                        </span>
                      ) : (
                        ""
                      )}
                      {item?.title}
                    </td>
                    <td>
                      <span>
                        {`${item?.startHour}:${item?.startMinute}`} -{" "}
                        {`${item?.endHour}:${item?.endMinute}`}
                      </span>
                    </td>
                    <div key={item?.id} className="times">
                      <td>
                        {`${item?.minute}`.padStart(2, "0")}:
                        {`${item?.second}`.padStart(2, "0")}
                      </td>

                      <td>
                        <button
                          id={item?.id}
                          name={item?.title}
                          className="btn"
                          onClick={handleEdit}
                        >
                          {<CiPlay1 />}
                        </button>
                      </td>
                      <td>
                        <button
                          id={item?.id}
                          className="btn"
                          onClick={showModal2}
                        >
                          {<AiFillDelete />}
                        </button>
                      </td>
                    </div>
                  </tr>
                  {showId === item?.id
                    ? item.old.map((item) => (
                        <tr key={item?.id}>
                          <td className="clent">{item?.title}</td>
                          <td>
                            <span>
                              {`${item?.startHour}:${item?.startMinute}`} -{" "}
                              {`${item?.endHour}:${item?.endMinute}`}
                            </span>
                          </td>
                          <div key={item?.id} className="times">
                            <td>
                              {`${item?.minute}`.padStart(2, "0")}:
                              {`${item?.second}`.padStart(2, "0")}
                            </td>

                            <td>
                              <button
                                id={item?.id}
                                className="btn"
                                onClick={showModal2}
                              >
                                {<AiFillDelete />}
                              </button>
                            </td>
                          </div>
                        </tr>
                      ))
                    : ""}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
