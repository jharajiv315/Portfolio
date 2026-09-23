import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  clearAllMessageErrors,
  deleteMessage,
  getAllMessages,
  resetMessagesSlice,
} from "@/store/slices/messageSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigateTo = useNavigate();
  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  const { messages, loading, error, message } = useSelector(
    (state) => state.messages
  );

  const [messageId, setMessageId] = useState("");
  const handleMessageDelete = (id) => {
    setMessageId(id);
    dispatch(deleteMessage(id));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllMessageErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetMessagesSlice());
      dispatch(getAllMessages());
    }
  }, [dispatch, error, message, loading]);

  return (
    <>
      <div className="min-h-[100vh] sm:gap-4 sm:py-4 sm:pl-20">
        <Tabs>
          <TabsContent>
            <Card>
              <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
                <CardTitle>Messages</CardTitle>
                <Button className="w-fit" onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {messages && messages.length > 0 ? (
                  messages.map((element) => {
                    return (
                      <Card key={element._id} className="p-5 flex flex-col justify-between shadow-xs border-border bg-card hover:border-primary/40 transition-all rounded-2xl">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-secondary text-primary font-bold text-xs flex items-center justify-center border border-border">
                                {element.senderName ? element.senderName.charAt(0).toUpperCase() : "M"}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-foreground">{element.senderName}</h4>
                                <span className="text-[11px] text-muted-foreground">
                                  {element.createdAt ? new Date(element.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-secondary text-primary border border-border">
                              Inquiry
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-foreground/90">
                            <span className="text-muted-foreground font-normal">Subject: </span>
                            {element.subject}
                          </div>

                          <div className="text-xs sm:text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/50">
                            {element.message}
                          </div>
                        </div>

                        <CardFooter className="justify-end p-0 pt-4">
                          {loading && (messageId === element._id) ? (
                            <SpecialLoadingButton
                              content={"Deleting"}
                              width={"w-24"}
                            />
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-24 rounded-full text-xs"
                              onClick={() => handleMessageDelete(element._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <p className="text-base font-serif">No messages received yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Messages;
