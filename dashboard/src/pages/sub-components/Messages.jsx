import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  clearAllMessageErrors,
  deleteMessage,
  getAllMessages,
  replyMessage,
  resetMessagesSlice,
} from "@/store/slices/messageSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./SpecialLoadingButton";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Reply,
  CheckCircle2,
  Clock,
  Send,
  X,
  CornerDownRight,
  Trash2,
} from "lucide-react";

// Helper to extract email from text if missing on parent object
const extractEmail = (email, messageText) => {
  if (email && email.includes("@")) return email.trim();
  if (!messageText) return "";
  const clientMatch = messageText.match(/Client Email:\s*([^\s\n\r]+)/i);
  if (clientMatch && clientMatch[1]?.includes("@")) return clientMatch[1].trim();
  const generalMatch = messageText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (generalMatch) return generalMatch[0].trim();
  return "";
};

const Messages = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleReturnToDashboard = () => {
    navigateTo("/");
  };

  const { messages, loading, error, message, lastReplyResult } = useSelector(
    (state) => state.messages
  );

  const [messageId, setMessageId] = useState("");

  // Reply Modal State
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const handleOpenReply = (element) => {
    const senderEmail = extractEmail(element.email, element.message);
    if (!senderEmail) {
      toast.error("This message does not contain a valid sender email address.");
      return;
    }
    setSelectedMessage({ ...element, resolvedEmail: senderEmail });
    setReplySubject(`Re: ${element.subject || "Your Portfolio Inquiry"}`);
    setReplyBody("");
    setIsReplyOpen(true);
  };

  const handleCloseReply = () => {
    setIsReplyOpen(false);
    setSelectedMessage(null);
    setReplySubject("");
    setReplyBody("");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyBody.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }
    if (!selectedMessage?._id) return;

    setMessageId(selectedMessage._id);
    dispatch(
      replyMessage(selectedMessage._id, {
        replySubject: replySubject.trim(),
        replyMessage: replyBody.trim(),
      })
    );
  };

  const handleMessageDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setMessageId(id);
      dispatch(deleteMessage(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllMessageErrors());
    }
    if (message) {
      if (lastReplyResult && lastReplyResult.emailDelivered === false && lastReplyResult.mailtoUrl) {
        toast.info(message, { autoClose: 9000 });
        window.open(lastReplyResult.mailtoUrl, "_blank");
      } else {
        toast.success(message);
      }
      setIsReplyOpen(false);
      setSelectedMessage(null);
      dispatch(resetMessagesSlice());
      dispatch(getAllMessages());
    }
  }, [dispatch, error, message, lastReplyResult]);

  return (
    <>
      <div className="min-h-[100vh] sm:gap-4 sm:py-4 sm:pl-20 p-4">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card className="border-border shadow-xs bg-card">
              <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center border-b border-border pb-6">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-primary font-semibold block mb-1">
                    Inbox & Communications
                  </span>
                  <CardTitle className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                    Client & Visitor Messages
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    View inquiries, manage contact requests, and reply directly via email
                  </p>
                </div>
                <Button variant="outline" className="w-fit rounded-full" onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
              </CardHeader>

              <CardContent className="grid sm:grid-cols-2 gap-5 pt-6">
                {messages && messages.length > 0 ? (
                  messages.map((element) => {
                    const senderEmail = extractEmail(element.email, element.message);
                    const isReplied = Boolean(element.replied);

                    return (
                      <Card
                        key={element._id}
                        className={`p-5 flex flex-col justify-between shadow-xs border bg-card transition-all rounded-2xl ${
                          isReplied ? "border-green-500/30" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="space-y-3.5">
                          {/* Top Row: Sender Info & Status Badge */}
                          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-secondary text-primary font-bold text-sm flex items-center justify-center border border-border">
                                {element.senderName ? element.senderName.charAt(0).toUpperCase() : "M"}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                                  {element.senderName}
                                </h4>
                                {senderEmail && (
                                  <a
                                    href={`mailto:${senderEmail}`}
                                    className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {senderEmail}
                                  </a>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              {isReplied ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                                  <CheckCircle2 className="h-3 w-3" /> Replied
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                                  <Clock className="h-3 w-3" /> New
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground">
                                {element.createdAt
                                  ? new Date(element.createdAt).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Recently"}
                              </span>
                            </div>
                          </div>

                          {/* Subject */}
                          <div className="text-xs font-semibold text-foreground/90">
                            <span className="text-muted-foreground font-normal">Subject: </span>
                            {element.subject}
                          </div>

                          {/* Message Content */}
                          <div className="text-xs sm:text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-muted/40 p-3.5 rounded-xl border border-border/50">
                            {element.message}
                          </div>

                          {/* Replied Section (if replied) */}
                          {isReplied && element.replyMessage && (
                            <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-xs">
                              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold mb-1">
                                <CornerDownRight className="h-3.5 w-3.5" />
                                <span>Your Reply</span>
                                {element.repliedAt && (
                                  <span className="text-[10px] font-normal text-muted-foreground ml-auto">
                                    {new Date(element.repliedAt).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="text-foreground/90 whitespace-pre-wrap pl-5 border-l-2 border-emerald-400">
                                {element.replyMessage}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Card Actions */}
                        <CardFooter className="flex items-center justify-between p-0 pt-4 mt-3 border-t border-border/40">
                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-full text-xs flex items-center gap-1.5 shadow-xs"
                            onClick={() => handleOpenReply(element)}
                          >
                            <Reply className="h-3.5 w-3.5" />
                            {isReplied ? "Reply Again" : "Reply via Email"}
                          </Button>

                          {loading && messageId === element._id ? (
                            <SpecialLoadingButton content={"Deleting"} width={"w-20"} />
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                              onClick={() => handleMessageDelete(element._id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-16 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-base font-serif font-medium">No messages received yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      New messages submitted through your portfolio contact form will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ================= REPLY MODAL DIALOG ================= */}
      {isReplyOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Reply className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground leading-tight">
                    Reply to {selectedMessage.senderName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Sending direct email to{" "}
                    <span className="font-mono text-primary font-medium">
                      {selectedMessage.resolvedEmail}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseReply}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendReply} className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
              {/* Context Quote of Original Message */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                <span className="font-bold text-[10px] uppercase text-muted-foreground tracking-wider block">
                  Original Inquiry Preview:
                </span>
                <p className="font-semibold text-foreground">{selectedMessage.subject}</p>
                <p className="text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Subject Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Subject
                </label>
                <Input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Subject"
                  required
                  className="rounded-xl bg-background"
                />
              </div>

              {/* Reply Body */}
              <div className="space-y-1.5 flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Reply Message
                </label>
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Hi, thanks for reaching out! Regarding your project idea..."
                  rows={6}
                  required
                  className="rounded-xl resize-none bg-background leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground">
                  This response will be sent directly to <strong>{selectedMessage.resolvedEmail}</strong> with your personal portfolio branding and a quote of their original message.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={handleCloseReply}
                >
                  Cancel
                </Button>

                {loading ? (
                  <SpecialLoadingButton content={"Sending Email..."} width={"w-32"} />
                ) : (
                  <Button
                    type="submit"
                    className="rounded-full text-xs flex items-center gap-2 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Reply
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
