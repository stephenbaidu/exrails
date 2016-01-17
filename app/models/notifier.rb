
class Notifier
  def self.notify(type, message)
    webhook_url = ''
    notifier = Slack::Notifier.new webhook_url, channel: '#apps', username: 'eXRails App', icon_emoji: ':bomb:'
    
    text = message
    text += "\nhttps://github.com/stephenbaidu/exrails|Go to App>"
    
    notifier.ping text
  end
end